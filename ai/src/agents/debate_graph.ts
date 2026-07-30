import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

export interface DebateState {
  messages: BaseMessage[];
  nutritionAdvice: string | null;
  ayurvedaAdvice: string | null;
  medicalAdvice: string | null;
  lifestyleAdvice: string | null;
  finalJudgment: string | null;
}

const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0,
});

// 1. Nutrition Agent
const nutritionAgentNode = async (state: DebateState) => {
  const lastMsg = state.messages[state.messages.length - 1].content;
  const prompt = new SystemMessage("You are the Nutrition Agent. Provide advice on diet, macronutrients, and food intake based on the user's query.");
  const response = await llm.invoke([prompt, new HumanMessage(lastMsg as string)]);
  return { nutritionAdvice: response.content.toString() };
};

// 2. Ayurveda Agent
const ayurvedaAgentNode = async (state: DebateState) => {
  const lastMsg = state.messages[state.messages.length - 1].content;
  const prompt = new SystemMessage("You are the Ayurveda Agent. Provide advice on Doshas (Vata, Pitta, Kapha) and herbal remedies based on the user's query.");
  const response = await llm.invoke([prompt, new HumanMessage(lastMsg as string)]);
  return { ayurvedaAdvice: response.content.toString() };
};

// 3. Medical Agent
const medicalAgentNode = async (state: DebateState) => {
  const lastMsg = state.messages[state.messages.length - 1].content;
  const prompt = new SystemMessage("You are the Medical Agent. Provide modern medical advice, suggest relevant lab tests (e.g., CBC, LFT), and identify red flags.");
  const response = await llm.invoke([prompt, new HumanMessage(lastMsg as string)]);
  return { medicalAdvice: response.content.toString() };
};

// 4. Lifestyle Agent
const lifestyleAgentNode = async (state: DebateState) => {
  const lastMsg = state.messages[state.messages.length - 1].content;
  const prompt = new SystemMessage("You are the Lifestyle Agent. Provide advice on sleep, stress management, and exercise.");
  const response = await llm.invoke([prompt, new HumanMessage(lastMsg as string)]);
  return { lifestyleAdvice: response.content.toString() };
};

// 5. Final Judge
const finalJudgeNode = async (state: DebateState) => {
  const userQuery = state.messages[state.messages.length - 1].content;
  const synthesisPrompt = new SystemMessage(`You are the Final Judge of the Medical Board. 
Review the user's query and the advice from all 4 specialists. Synthesize them into one coherent, actionable plan.
Resolve any conflicts. Provide reasoning. Provide your Retrieval Confidence %.

User Query: ${userQuery}
---
Nutrition Advice: ${state.nutritionAdvice}
---
Ayurveda Advice: ${state.ayurvedaAdvice}
---
Medical Advice: ${state.medicalAdvice}
---
Lifestyle Advice: ${state.lifestyleAdvice}
`);

  const response = await llm.invoke([synthesisPrompt]);
  return { 
    finalJudgment: response.content.toString(),
    messages: [response] 
  };
};

export const createDebateGraph = () => {
  const graphState = {
    messages: {
      value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
    nutritionAdvice: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    },
    ayurvedaAdvice: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    },
    medicalAdvice: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    },
    lifestyleAdvice: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    },
    finalJudgment: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    }
  };

  const workflow = new StateGraph({ channels: graphState as any });

  // Add Nodes
  workflow.addNode("nutrition_agent", nutritionAgentNode);
  workflow.addNode("ayurveda_agent", ayurvedaAgentNode);
  workflow.addNode("medical_agent", medicalAgentNode);
  workflow.addNode("lifestyle_agent", lifestyleAgentNode);
  workflow.addNode("final_judge", finalJudgeNode);

  // Flow: START -> Parallel execution of all 4 agents -> Final Judge -> END
  workflow.addEdge(START, "nutrition_agent" as any);
  workflow.addEdge(START, "ayurveda_agent" as any);
  workflow.addEdge(START, "medical_agent" as any);
  workflow.addEdge(START, "lifestyle_agent" as any);
  
  workflow.addEdge("nutrition_agent" as any, "final_judge" as any);
  workflow.addEdge("ayurveda_agent" as any, "final_judge" as any);
  workflow.addEdge("medical_agent" as any, "final_judge" as any);
  workflow.addEdge("lifestyle_agent" as any, "final_judge" as any);

  workflow.addEdge("final_judge" as any, END);

  return workflow.compile();
};
