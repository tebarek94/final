import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use the correct model name
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export const generateMealSuggestion = async (
  userProfile: any,
  mealType: string,
  preferences: string[]
): Promise<string | { raw_response: string }> => {
  try {
    const prompt = `
      As a nutrition expert, suggest a personalized ${mealType} meal for a user with the following profile:
      
      Age: ${userProfile.age}
      Gender: ${userProfile.gender}
      Weight: ${userProfile.weight} kg
      Height: ${userProfile.height} cm
      Activity Level: ${userProfile.activity_level}
      Fitness Goal: ${userProfile.fitness_goal}
      Dietary Preferences: ${userProfile.dietary_preferences?.join(', ')}
      Allergies: ${userProfile.allergies?.join(', ')}
      
      Additional Preferences: ${preferences.join(', ')}
      
      Please provide:
      1. A meal suggestion with ingredients and quantities
      2. Nutritional information (calories, protein, carbs, fat)
      3. Brief explanation of why this meal fits their profile
      4. Any modifications they could make
      
      Format the response as JSON with the following structure:
      {
        "meal_name": "string",
        "ingredients": [{"name": "string", "amount": number, "unit": "string"}],
        "nutrition": {"calories": number, "protein": number, "carbs": number, "fat": number},
        "explanation": "string",
        "modifications": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      return JSON.parse(text);
    } catch {
      // If not valid JSON, return the raw text
      return { raw_response: text };
    }
  } catch (error) {
    console.error('Error generating meal suggestion:', error);
    // Remove fallback responses - just throw the error
    throw new Error('Failed to generate meal suggestion');
  }
};

export const analyzeNutrition = async (mealData: any): Promise<string | { raw_response: string }> => {
  try {
    const prompt = `
      Analyze the following meal data and provide nutritional insights:
      
      Meal: ${JSON.stringify(mealData)}
      
      Please provide:
      1. Overall nutritional quality score (1-10)
      2. Key nutritional benefits
      3. Potential improvements
      4. How it fits into a balanced diet
      
      Format as JSON:
      {
        "score": number,
        "benefits": ["string"],
        "improvements": ["string"],
        "diet_fit": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      return { raw_response: text };
    }
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    // Remove fallback responses - just throw the error
    throw new Error('Failed to analyze nutrition');
  }
};

export default genAI;
