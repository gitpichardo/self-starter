import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mockDatabase';
import { nextAuthOptions } from '@/lib/auth';
import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  status: z.string(),
  roadmap: z.string().nullable().optional(),
});

const isDemoMode = process.env.DEMO_MODE === 'true';
const isMockDatabase = process.env.USE_MOCK_DB === 'true';

export async function GET(req: NextRequest) {
  console.log('GET /api/goals - Start');
  console.log('isDemoMode:', isDemoMode);
  console.log('isMockDatabase:', isMockDatabase);

  let userId: string;

  try {
    if (isDemoMode) {
      userId = "1"; // Demo user ID
      console.log('Using demo user ID:', userId);
    } else {
      const session = await getServerSession(nextAuthOptions);
      console.log('Session:', JSON.stringify(session, null, 2));
      if (!session || !session.user) {
        console.log('No session or user found');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = session.user.id || session.user.email as string;
      if (!userId) {
        console.error('User ID not found in session:', session);
        return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
      }
      console.log('Using authenticated user ID:', userId);
    }

    let goals;
    if (isMockDatabase) {
      console.log('Using mock database for fetching goals');
      goals = await mockDb.getGoalsByUserId(userId);
    } else {
      console.log('Using Prisma database for fetching goals');
      goals = await prisma.goal.findMany({
        where: { userId: userId },
      });
    }

    console.log(`Goals fetched successfully for user: ${userId}`);
    console.log('Goals:', JSON.stringify(goals, null, 2));
    return NextResponse.json({ goals, isMockDatabase });
  } catch (error) {
    console.error('Error in GET /api/goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals', details: error }, { status: 500 });
  } finally {
    console.log('GET /api/goals - End');
  }
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Safely access the user ID
  const userId = session.user.id || session.user.email;

  if (!userId) {
    console.error('User ID not found in session:', session);
    return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
  }

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
      userId,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      description: validatedData.description || null,
      roadmap: validatedData.roadmap ?? null,
    };
    console.log('Goal data:', goalData);

    let newGoal;
    const isMockDatabase = process.env.USE_MOCK_DB === 'true';

    if (isMockDatabase) {
      console.log('Using mock database');
      newGoal = await mockDb.createGoal(goalData);
      console.log('Created goal in mock DB:', newGoal);
    } else {
      console.log('Using Prisma database');
      try {
        newGoal = await prisma.goal.create({
          data: goalData,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json({ error: 'Database Error', details: dbError }, { status: 500 });
      }
    }

    console.log('Created goal:', newGoal);
    return NextResponse.json({ goal: newGoal, isMockDatabase }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}