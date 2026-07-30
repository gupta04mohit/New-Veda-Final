import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createVedaOrchestrator } from './orchestrator';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { initKnowledgeGraph } from './neo4j';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

// Initialize Neo4j Knowledge Graph
initKnowledgeGraph();

let orchestrator: any = null;

app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, context, chatHistory, image } = req.body;

    if (!orchestrator) {
      orchestrator = createVedaOrchestrator();
    }

    // Parse past history
    const pastMessages = (chatHistory || []).map((msg: any) => {
      return msg.role === 'AI' ? new AIMessage(msg.message) : new HumanMessage(msg.message);
    });

    let currentHumanMessage;
    if (image) {
      currentHumanMessage = new HumanMessage({
        content: [
          { type: 'text', text: message },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image}` } }
        ]
      });
    } else {
      currentHumanMessage = new HumanMessage(message);
    }

    const initialState = {
      messages: [...pastMessages, currentHumanMessage],
      nextAgent: null,
      doshaProfile: null,
      currentSymptoms: [],
      healthScore: 100,
      userContext: context || {}
    };

    console.log("AI Service: Invoking Orchestrator with message:", message);
    const finalState = await orchestrator.invoke(initialState);
    
    const lastMessage = finalState.messages[finalState.messages.length - 1];

    res.json({
      response: lastMessage.content || "I am currently processing your request.",
      routedAgent: finalState.nextAgent
    });

  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ error: 'Error processing AI request' });
  }
});

import { createDebateGraph } from './agents/debate_graph';
let debateGraph: any = null;

app.post('/debate', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!debateGraph) {
      debateGraph = createDebateGraph();
    }

    const initialState = {
      messages: [new HumanMessage(message)],
      nutritionAdvice: null,
      ayurvedaAdvice: null,
      medicalAdvice: null,
      lifestyleAdvice: null,
      finalJudgment: null
    };

    console.log("AI Service: Invoking Debate Graph for Medical Board...");
    const finalState = await debateGraph.invoke(initialState);

    res.json({
      nutrition: finalState.nutritionAdvice,
      ayurveda: finalState.ayurvedaAdvice,
      medical: finalState.medicalAdvice,
      lifestyle: finalState.lifestyleAdvice,
      finalJudgment: finalState.finalJudgment
    });

  } catch (error) {
    console.error("Debate Graph Error:", error);
    res.status(500).json({ error: 'Error processing debate request' });
  }
});


import { scanFoodImage } from './services/vision_scanner';
import { analyzeMedicalReport } from './services/report_analyzer';
import { predictDiseaseRisk } from './services/risk_prediction';
import { checkMedicineInteraction } from './services/interaction_checker';

app.post('/scan', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Missing image" });
    const result = await scanFoodImage(image);
    res.json({ result });
  } catch (err) {
    console.error("Vision API Error:", err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

app.post('/analyze-report', async (req: Request, res: Response) => {
  try {
    const { extractedText } = req.body;
    if (!extractedText) return res.status(400).json({ error: "Missing extractedText" });
    const result = await analyzeMedicalReport(extractedText);
    res.json({ result });
  } catch (err) {
    console.error("Report Analyzer Error:", err);
    res.status(500).json({ error: "Failed to analyze medical report" });
  }
});

app.post('/predict-risk', async (req: Request, res: Response) => {
  try {
    const { age, weight, sleepHours, exerciseMinutes, familyHistory } = req.body;
    const result = await predictDiseaseRisk({ age, weight, sleepHours, exerciseMinutes, familyHistory });
    res.json({ result });
  } catch (err) {
    console.error("Risk Prediction Error:", err);
    res.status(500).json({ error: "Failed to predict disease risk" });
  }
});

app.post('/check-interaction', async (req: Request, res: Response) => {
  try {
    const { currentMeds, newHerbOrMed } = req.body;
    if (!currentMeds || !newHerbOrMed) return res.status(400).json({ error: "Missing inputs" });
    const result = await checkMedicineInteraction(currentMeds, newHerbOrMed);
    res.json({ result });
  } catch (err) {
    console.error("Interaction Checker Error:", err);
    res.status(500).json({ error: "Failed to check interactions" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AI Microservice is running on port ${PORT}`);
});
