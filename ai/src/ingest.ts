import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const dummyKnowledge = [
  { text: "Vata dosha is composed of Air and Space. Symptoms of excess Vata include dry skin, anxiety, and irregular digestion.", metadata: { source: "Ayurvedic Basics", category: "dosha" } },
  { text: "Pitta dosha is composed of Fire and Water. Symptoms of excess Pitta include acidity, inflammation, and anger.", metadata: { source: "Ayurvedic Basics", category: "dosha" } },
  { text: "Kapha dosha is composed of Earth and Water. Symptoms of excess Kapha include lethargy, weight gain, and congestion.", metadata: { source: "Ayurvedic Basics", category: "dosha" } },
  { text: "Ashwagandha is an adaptogenic herb used to balance Vata, reduce stress, and improve energy levels.", metadata: { source: "Herbology", category: "herbs" } },
  { text: "According to Charaka Samhita, Chapter 6: 'One should consume food that is warm, unctuous, in proper quantity, after digestion of the previous meal, and non-antagonistic.'", metadata: { source: "Charaka Samhita", category: "diet" } },
  { text: "According to Sushruta Samhita: 'The root cause of all diseases is the accumulation of Ama (toxins) due to weak Agni (digestive fire).'", metadata: { source: "Sushruta Samhita", category: "pathology" } },
  { text: "Ashtanga Hridayam states: 'In the morning, one should drink water kept overnight in a copper vessel to balance all three doshas.'", metadata: { source: "Ashtanga Hridayam", category: "lifestyle" } }
];

export const ingestData = async () => {
  try {
    console.log("Starting data ingestion into ChromaDB...");
    
    const embeddings = new OpenAIEmbeddings({ modelName: "text-embedding-3-small" });
    
    const vectorStore = await Chroma.fromTexts(
      dummyKnowledge.map(doc => doc.text),
      dummyKnowledge.map(doc => doc.metadata),
      embeddings,
      {
        collectionName: "veda_knowledge",
        // url: "http://localhost:8000" // if running external Chroma docker container
      }
    );
    
    console.log("Ingestion complete!");
  } catch (error) {
    console.error("Error ingesting data:", error);
  }
};

// Run if called directly
if (require.main === module) {
  ingestData();
}
