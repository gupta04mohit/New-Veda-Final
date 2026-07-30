import { getNeo4jSession } from '../neo4j';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

export const hybridSearch = async (query: string): Promise<string> => {
  // 1. Semantic Search (ChromaDB)
  const vectorStore = new Chroma(new OpenAIEmbeddings(), {
    collectionName: "vedaai-docs",
    url: process.env.CHROMA_URL || "http://localhost:8000"
  });
  
  let vectorResults = "";
  try {
    const results = await vectorStore.similaritySearch(query, 3);
    vectorResults = results.map(r => r.pageContent).join("\n\n");
  } catch (e) {
    console.log("ChromaDB retrieval failed, skipping vector search.", e);
  }

  // 2. Knowledge Graph Entity Extraction (LLM)
  const llm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });
  const entityExtraction = await llm.invoke(`Extract the main health or Ayurvedic concepts from this query as a comma-separated list. Query: "${query}"`);
  const entities = entityExtraction.content.toString().split(',').map(e => e.trim());

  // 3. Knowledge Graph Traversal (Neo4j)
  let graphResults = "";
  const session = getNeo4jSession();
  try {
    for (const entity of entities) {
      const result = await session.run(
        `MATCH (c:Concept {name: $entity})-[r]->(related) 
         RETURN c.name as source, type(r) as relation, related.name as target LIMIT 5`,
        { entity }
      );
      result.records.forEach(record => {
        graphResults += `- ${record.get('source')} ${record.get('relation')} ${record.get('target')}\n`;
      });
    }
  } catch (e) {
    console.log("Neo4j retrieval failed, skipping graph search.", e);
  } finally {
    await session.close();
  }

  // 4. Combine Context
  return `=== Semantic Context (ChromaDB) ===\n${vectorResults}\n\n=== Relationship Context (Neo4j) ===\n${graphResults}`;
};
