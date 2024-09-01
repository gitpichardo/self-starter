import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '@/lib/auth';

const JIGSAW_STACK_API_KEY = process.env.JIGSAW_STACK_API_KEY;
const JIGSAW_STACK_API_URL = 'https://api.jigsawstack.com/v1/prompt_engine';

export async function POST(req: NextRequest) {
  console.log('POST /api/generate-roadmap - Start');
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { goal, timeframe, experience } = await req.json();
    console.log('Received data:', { goal, timeframe, experience });

    if (!goal || !timeframe || !experience) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("x-api-key", JIGSAW_STACK_API_KEY || '');

    const createRequestBody = {
      prompt: "Generate a detailed roadmap for achieving the following goal: {goal}. The timeframe is {timeframe} and the person's experience level is {experience}. Include major milestones and actionable steps.",
      inputs: [
        { key: "goal", optional: false },
        { key: "timeframe", optional: false },
        { key: "experience", optional: false }
      ],
      return_prompt: {
        roadmap: "A detailed step-by-step roadmap to achieve the goal",
        milestones: "An array of key milestones in the roadmap"
      }
    };

    console.log('Sending create request to JigsawStack:', createRequestBody);

    //Create the prompt engine
    const createResponse = await fetch(JIGSAW_STACK_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(createRequestBody),
    });
    
    const contentType = createResponse.headers.get("content-type");
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Error from JigsawStack API:', errorText);
      throw new Error(`Request failed with status ${createResponse.status}: ${errorText}`);
    }
    
    let createResult;
    
    if (contentType && contentType.includes("application/json")) {
      createResult = await createResponse.json();
    } else {
      const textResponse = await createResponse.text();
      console.error('Unexpected non-JSON response:', textResponse);
      throw new Error('Received non-JSON response');
    }
    
    console.log('JigsawStack API create response:', createResult);

    
    

    if (createResult.success && createResult.prompt_engine_id) {
      //Run the prompt
      const runRequestBody = {
        input_values: { goal, timeframe, experience }
      };

      console.log('Sending run request to JigsawStack:', runRequestBody);

      const runResponse = await fetch(`${JIGSAW_STACK_API_URL}/${createResult.prompt_engine_id}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(runRequestBody),
      });

      console.log('Run response status:', runResponse.status);

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error('Error running prompt:', runResponse.status, errorText);
        throw new Error(`Failed to run prompt: ${runResponse.status} ${errorText}`);
      }

      const runResult = await runResponse.json();
      console.log('Run result:', runResult);

      return NextResponse.json(runResult.result);
    } else {
      throw new Error('Failed to create prompt engine');
    }
  } catch (error) {
    console.error('Error in generate-roadmap:', error);
    return NextResponse.json({ 
      error: 'An error occurred while generating the roadmap',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    console.log('POST /api/generate-roadmap - End');
  }
}