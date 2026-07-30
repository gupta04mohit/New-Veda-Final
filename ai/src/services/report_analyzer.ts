import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export const analyzeMedicalReport = async (extractedText: string): Promise<string> => {
  const llm = new ChatOpenAI({ modelName: "gpt-4-turbo", temperature: 0 });
  
  const prompt = new SystemMessage(`You are VedaAI's Medical Report Analyzer.
The user has uploaded a medical report (like CBC, LFT, KFT) which has been OCR extracted into text.
Analyze the following text and provide a structured JSON response containing:
1. "abnormal_values": List of values out of normal range.
2. "possible_reasons": Short clinical explanations for these abnormalities.
3. "lifestyle_advice": Ayurvedic and lifestyle recommendations to address them.
4. "doctor_consultation": Boolean indicating if they need to see a doctor immediately.
`);

  const response = await llm.invoke([
    prompt,
    new HumanMessage(`Extracted Report Text:\n${extractedText}`)
  ]);
  
  return response.content.toString();
};
