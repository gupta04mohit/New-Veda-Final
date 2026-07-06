import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createVedaOrchestrator } from './orchestrator';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

let orchestrator: any = null;

  app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!orchestrator) {
      orchestrator = createVedaOrchestrator();
    }

    const initialState = {
      messages: [new HumanMessage(message)],
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

app.post('/scan', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "Missing imageBase64" });
    
    const visionLlm = new ChatOpenAI({ modelName: "gpt-4o-mini", maxTokens: 500 });
    const response = await visionLlm.invoke([
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this food image. Provide: 1) Estimated calories, 2) Macros (Protein, Carbs, Fats), 3) Ayurvedic Dosha effect (Vata/Pitta/Kapha), and 4) Inflammation score (1-10). Keep it concise." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      }
    ]);
    
    res.json({ result: response.content });
  } catch (err) {
    console.error("Vision API Error:", err);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AI Microservice is running on port ${PORT}`);
});
