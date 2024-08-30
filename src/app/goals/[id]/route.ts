import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const goalId = params.id;
    const { roadmap } = await req.json();

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: session.user.id,
      },
      data: {
        roadmap: roadmap as Prisma.JsonValue,
      } as unknown as Prisma.GoalUpdateInput,
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}