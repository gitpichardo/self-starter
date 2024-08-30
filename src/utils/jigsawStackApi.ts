const JIGSAW_STACK_API_KEY = process.env.JIGSAW_STACK_API_KEY;
const JIGSAW_STACK_API_URL = 'https://api.jigsawstack.com/v1/prompt_engine';

interface JigsawStackResponse {
  roadmap: string;
  milestones: string[];
}

export async function generateRoadmap(goal: string, timeframe: string, experience: string): Promise<JigsawStackResponse> {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  headers.append("x-api-key", JIGSAW_STACK_API_KEY || '');

  const prompt = `Generate a detailed roadmap for achieving the following goal: "${goal}". 
  The timeframe is ${timeframe} and the person's experience level is ${experience}. 
  Include major milestones and actionable steps.`;

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: prompt,
      return_prompt: {
        roadmap: "A detailed step-by-step roadmap to achieve the goal",
        milestones: "An array of key milestones in the roadmap"
      }
    })
  };

  try {
    const response = await fetch(JIGSAW_STACK_API_URL, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to generate roadmap');
    }
    const data = await response.json();
    return data as JigsawStackResponse;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
}