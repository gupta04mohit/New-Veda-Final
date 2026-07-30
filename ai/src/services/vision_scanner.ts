import { ChatOpenAI } from '@langchain/openai';

export const scanFoodImage = async (imageBase64: string): Promise<string> => {
  const visionLlm = new ChatOpenAI({ modelName: "gpt-4o", maxTokens: 500 });
  const response = await visionLlm.invoke([
    {
      role: "user",
      content: [
        { 
          type: "text", 
          text: "Analyze this food image. Provide a JSON response with: 1) Estimated calories, 2) Macros (Protein, Carbs, Fats), 3) Ayurvedic Dosha effect (Vata/Pitta/Kapha), and 4) Inflammation score (1-10). Keep it concise." 
        },
        { 
          type: "image_url", 
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` } 
        }
      ]
    }
  ]);
  
  return response.content.toString();
};
