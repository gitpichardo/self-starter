// src/app/api/goals/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`GET /api/goals/${params.id} - Start`);
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goalId = params.id;
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
    console.error(`Error fetching goal ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`GET /api/goals/${params.id} - End`);
  }
}