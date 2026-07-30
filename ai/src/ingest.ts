import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export const ingestData = async () => {
  try {
    console.log("Starting Real RAG data ingestion into ChromaDB...");
    const docsPath = path.join(__dirname, "../docs");
    
    if (!fs.existsSync(docsPath)) {
      console.log(`Creating docs directory at ${docsPath}. Please place PDF files here.`);
      fs.mkdirSync(docsPath, { recursive: true });
      return; 
    }

    console.log("Loading documents from directory...");
    const files = fs.readdirSync(docsPath).filter(f => f.endsWith(".pdf"));
    
    if (files.length === 0) {
      console.log("No documents found in docs directory. Place PDFs there to ingest.");
      return;
    }

    const docs = [];
    for (const file of files) {
      const loader = new PDFLoader(path.join(docsPath, file));
      const loadedDocs = await loader.load();
      docs.push(...loadedDocs);
    }
    
    if (docs.length === 0) {
      console.log("No documents found in docs directory. Place PDFs there to ingest.");
      return;
    }
    
    console.log(`Loaded ${docs.length} documents. Splitting into chunks...`);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splits = await textSplitter.splitDocuments(docs);
    console.log(`Created ${splits.length} chunks. Embedding into ChromaDB...`);

    const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });
    
    const chroma = new Chroma(embeddings, {
      collectionName: "vedaai-docs",
      url: process.env.CHROMA_URL || "http://localhost:8000",
    });

    console.log("Adding documents to ChromaDB...");
    await chroma.addDocuments(splits);
    console.log("Vector DB Ingestion Complete!");

    console.log("Extracting Knowledge Graph for Neo4j...");
    const { getNeo4jSession } = require('./neo4j');
    const { ChatOpenAI } = require('@langchain/openai');
    const llm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });
    const session = getNeo4jSession();

    try {
      // Process a small subset for graph to save time/tokens during demo
      const sampleSplits = splits.slice(0, Math.min(5, splits.length));
      for (const split of sampleSplits) {
        const extraction = await llm.invoke(`Extract medical and ayurvedic relationships from the text. 
Output them EXACTLY in this format: ConceptA|RELATIONSHIP|ConceptB
Text: ${split.pageContent.substring(0, 500)}`);
        
        const lines = extraction.content.toString().split('\n');
        for (const line of lines) {
          const parts = line.split('|');
          if (parts.length === 3) {
            const [source, relation, target] = parts.map((p: string) => p.trim().replace(/[^a-zA-Z0-9 ]/g, ""));
            if (source && relation && target) {
              await session.run(`
                MERGE (s:Concept {name: $source})
                MERGE (t:Concept {name: $target})
                MERGE (s)-[:${relation.toUpperCase().replace(/\s+/g, "_")}]->(t)
              `, { source, target });
            }
          }
        }
      }
      console.log("Neo4j Knowledge Graph Extraction Complete!");
    } catch (e) {
      console.error("Neo4j Extraction error:", e);
    } finally {
      await session.close();
    }
    
    console.log("Real RAG Ingestion complete! Knowledge base is updated.");
  } catch (error) {
    console.error("Error ingesting data:", error);
  }
};

// Run if called directly
if (require.main === module) {
  ingestData();
}
