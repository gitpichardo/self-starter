import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDatabase';
import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed']),
  roadmap: z.string().nullable().optional(),
});

const DEMO_USER_ID = "1";

export async function GET(req: NextRequest) {
  console.log('GET /api/goals - Start');
  try {
    const goals = await mockDb.getGoalsByUserId(DEMO_USER_ID);
    console.log('Goals fetched:', JSON.stringify(goals, null, 2));
    return NextResponse.json({ goals, isMockDatabase: true });
  } catch (error) {
    console.error('Error in GET /api/goals:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch goals', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  } finally {
    console.log('GET /api/goals - End');
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/goals - Start');
  try {
    const body = await req.json();
    console.log('Received body:', JSON.stringify(body, null, 2));

    const validatedData = goalSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    const goalData = {
      ...validatedData,
      userId: DEMO_USER_ID,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
    };

    console.log('Goal data to be created:', JSON.stringify(goalData, null, 2));

    const newGoal = await mockDb.createGoal(goalData as any);
    console.log('Created goal:', JSON.stringify(newGoal, null, 2));

    return NextResponse.json({ goal: newGoal, isMockDatabase: true }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/goals:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json({ 
      error: 'Failed to create goal', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    console.log('POST /api/goals - End');
  }
}