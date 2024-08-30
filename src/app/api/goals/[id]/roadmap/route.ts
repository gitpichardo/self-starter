// src/app/api/goals/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  const goalId = context.params?.id;
  console.log(`GET /api/goals/${goalId} - Start`);

  if (!goalId) {
    console.log('Goal ID is missing');
    return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Fetching goal ${goalId} for user: ${session.user.id}`);

    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!goal) {
      console.log(`Goal ${goalId} not found`);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    console.log(`Goal ${goalId} fetched successfully`);
    return NextResponse.json(goal);
  } catch (error) {
    console.error(`Error fetching goal ${goalId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`GET /api/goals/${goalId} - End`);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params?: { id?: string } }
) {
  const goalId = context.params?.id;
  console.log(`PUT /api/goals/${goalId} - Start`);

  if (!goalId) {
    console.log('Goal ID is missing');
    return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedGoalData = await req.json();

    console.log(`Updating goal ${goalId} for user: ${session.user.id}`);

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      data: updatedGoalData,
    });

    console.log(`Goal ${goalId} updated successfully`);
    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error(`Error updating goal ${goalId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`PUT /api/goals/${goalId} - End`);
  }
}