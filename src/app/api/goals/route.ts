import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mockDatabase';
import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  status: z.string(),
  roadmap: z.string().nullable().optional(),
});

const isMockDatabase = process.env.USE_MOCK_DB === 'true';

// Demo user ID
const DEMO_USER_ID = "1";

export async function GET(req: NextRequest) {
  console.log('GET /api/goals - Start');

  try {
    let goals;
    if (isMockDatabase) {
      console.log('Using mock database for fetching goals');
      goals = await mockDb.getGoalsByUserId(DEMO_USER_ID);
    } else {
      console.log('Using Prisma database for fetching goals');
      goals = await prisma.goal.findMany({
        where: { userId: DEMO_USER_ID },
      });
    }

    console.log(`Goals fetched successfully for demo user: ${DEMO_USER_ID}`);
    return NextResponse.json({ goals, isMockDatabase });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/goals - Start');

  try {
    const body = await req.json();
    console.log('Received body:', body);

    let validatedData;
    try {
      validatedData = goalSchema.parse(body);
      console.log('Validated data:', validatedData);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ error: 'Validation Error', details: validationError }, { status: 400 });
    }

    const goalData = {
      ...validatedData,
      userId: DEMO_USER_ID,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      description: validatedData.description || null,
      roadmap: validatedData.roadmap ?? null,
    };
    console.log('Goal data:', goalData);

    let newGoal;
    if (isMockDatabase) {
      console.log('Using mock database');
      newGoal = await mockDb.createGoal(goalData);
      console.log('Created goal in mock DB:', newGoal);
    } else {
      console.log('Using Prisma database');
      newGoal = await prisma.goal.create({
        data: goalData,
      });
    }

    console.log('Created goal:', newGoal);
    return NextResponse.json({ goal: newGoal, isMockDatabase }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}