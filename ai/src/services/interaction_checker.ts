import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export const checkMedicineInteraction = async (currentMeds: string[], newHerbOrMed: string): Promise<string> => {
  const llm = new ChatOpenAI({ modelName: "gpt-4-turbo", temperature: 0 });
  
  const prompt = new SystemMessage(`You are a Pharmacognosy and Pharmacology AI.
Check for interactions between the user's current medications and a new proposed herb or medication.
Output a JSON response with:
1. "safe": Boolean
2. "interaction_severity": "LOW", "MEDIUM", or "HIGH"
3. "details": Explanation of the interaction.
4. "consult_doctor": Boolean
`);

  const response = await llm.invoke([
    prompt,
    new HumanMessage(`Current Meds: ${currentMeds.join(', ')}\nProposed New Item: ${newHerbOrMed}`)
  ]);
  
  return response.content.toString();
};
