import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '@/lib/auth';
import { z } from 'zod';
import { mockDb } from '@/lib/mockDatabase';

const JIGSAW_STACK_API_KEY = process.env.JIGSAW_STACK_API_KEY;
const JIGSAW_STACK_API_URL = process.env.JIGSAW_STACK_API_URL || 'https://api.jigsawstack.com/v1/prompt_engine';
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';

// Input validation schema
const inputSchema = z.object({
  goal: z.string().min(1, "Goal is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  experience: z.string().min(1, "Experience level is required"),
});

async function fetchJigsawStack(url: string, method: string, body: any) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-Api-Key": JIGSAW_STACK_API_KEY || '',
  });

  const response = await fetch(url, { method, headers, body: JSON.stringify(body) });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    throw new Error('Received non-JSON response');
  }
}

async function generateRoadmapWithAPI(input: z.infer<typeof inputSchema>) {
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
  const createResult = await fetchJigsawStack(JIGSAW_STACK_API_URL, "POST", createRequestBody);
  console.log('JigsawStack API create response:', createResult);

  if (createResult.success && createResult.prompt_engine_id) {
    const runRequestBody = {
      input_values: input
    };

    console.log('Sending run request to JigsawStack:', runRequestBody);
    const runResult = await fetchJigsawStack(`${JIGSAW_STACK_API_URL}/${createResult.prompt_engine_id}`, "POST", runRequestBody);
    console.log('Run result:', runResult);

    return runResult.result;
  } else {
    throw new Error('Failed to create prompt engine');
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/generate-roadmap - Start');
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedInput = inputSchema.parse(body);
    console.log('Received data:', validatedInput);

    // Always use the real JigsawStack API for roadmap generation
    const result = await generateRoadmapWithAPI(validatedInput);

    // If using mock database, save the generated roadmap
    if (USE_MOCK_DB) {
      await mockDb.saveRoadmap(session.user.id, validatedInput.goal, result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-roadmap:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'An error occurred while generating the roadmap',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    console.log('POST /api/generate-roadmap - End');
  }
}