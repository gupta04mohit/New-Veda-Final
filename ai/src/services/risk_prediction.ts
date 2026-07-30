import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export interface HealthInputs {
  age: number;
  weight: number;
  sleepHours: number;
  exerciseMinutes: number;
  familyHistory: string[];
}

export const predictDiseaseRisk = async (inputs: HealthInputs): Promise<string> => {
  const llm = new ChatOpenAI({ modelName: "gpt-4-turbo", temperature: 0 });
  
  const prompt = new SystemMessage(`You are a Disease Risk Prediction Model.
Analyze the user's health inputs and output a JSON risk assessment for the following:
- Diabetes Risk
- Heart Risk
- Hypertension Risk
- Vitamin Deficiency

Format the JSON as an array of objects: [{ "disease": "Heart Risk", "percentage": 45, "reason": "...", "preventive_steps": "..." }]
`);

  const response = await llm.invoke([
    prompt,
    new HumanMessage(JSON.stringify(inputs))
  ]);
  
  return response.content.toString();
};
