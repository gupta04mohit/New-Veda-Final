import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const getNeo4jSession = () => {
  return driver.session();
};

export const closeNeo4jDriver = async () => {
  await driver.close();
};

// Initialize schema
export const initKnowledgeGraph = async () => {
  const session = getNeo4jSession();
  try {
    // Create constraints (Neo4j 5.x syntax)
    await session.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (c:Concept) REQUIRE c.name IS UNIQUE`);
    console.log("Neo4j Knowledge Graph initialized.");
  } catch (err) {
    console.error("Error initializing Neo4j:", err);
  } finally {
    await session.close();
  }
};
