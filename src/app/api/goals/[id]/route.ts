import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { mockDb } from '@/lib/mockDatabase';
import { nextAuthOptions } from '@/lib/auth';
import { z } from 'zod';

const goalUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  status: z.string().optional(),
  roadmap: z.string().nullable().optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const goalId = context.params.id;
  console.log(`GET /api/goals/${goalId} - Start`);

  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Fetching goal ${goalId} (User: ${session.user.id})`);

    const isMockDatabase = process.env.USE_MOCK_DB === 'true';
    let goal;

    if (isMockDatabase) {
      console.log('Using mock database');
      goal = await mockDb.findGoalById(goalId);
      if (goal && goal.userId !== session.user.id) {
        goal = null; // Ensure user owns the goal
      }
    } else {
      console.log('Using Prisma database');
      goal = await prisma.goal.findUnique({
        where: {
          id: goalId,
          userId: session.user.id,
        },
      });
    }

    if (!goal) {
      console.log(`Goal ${goalId} not found`);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    console.log(`Goal ${goalId} fetched successfully`);
    return NextResponse.json({ goal, isMockDatabase });
  } catch (error) {
    console.error(`Error fetching goal ${goalId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`GET /api/goals/${goalId} - End`);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const goalId = context.params.id;
  console.log(`PUT /api/goals/${goalId} - Start`);

  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = goalUpdateSchema.parse(body);

    console.log(`Updating goal ${goalId} (User: ${session.user.id})`);

    const isMockDatabase = process.env.USE_MOCK_DB === 'true';
    let updatedGoal;

    if (isMockDatabase) {
      console.log('Using mock database');
      const existingGoal = await mockDb.findGoalById(goalId);
      if (!existingGoal || existingGoal.userId !== session.user.id) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
      }
      updatedGoal = await mockDb.updateGoal(goalId, validatedData as any);
    } else {
      console.log('Using Prisma database');
      updatedGoal = await prisma.goal.update({
        where: {
          id: goalId,
          userId: session.user.id,
        },
        data: validatedData,
      });
    }

    if (!updatedGoal) {
      return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }

    console.log(`Goal ${goalId} updated successfully`);
    return NextResponse.json({ goal: updatedGoal, isMockDatabase });
  } catch (error) {
    console.error(`Error updating goal ${goalId}:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`PUT /api/goals/${goalId} - End`);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const goalId = context.params.id;
  console.log(`DELETE /api/goals/${goalId} - Start`);

  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Deleting goal ${goalId} (User: ${session.user.id})`);

    const isMockDatabase = process.env.USE_MOCK_DB === 'true';
    let deleted;

    if (isMockDatabase) {
      console.log('Using mock database for delete');
      const existingGoal = await mockDb.findGoalById(goalId);
      if (!existingGoal || existingGoal.userId !== session.user.id) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
      }
      deleted = await mockDb.deleteGoal(goalId);
    } else {
      console.log('Using Prisma database for delete');
      await prisma.goal.delete({
        where: {
          id: goalId,
          userId: session.user.id,
        },
      });
      deleted = true;
    }

    if (!deleted) {
      console.log(`Goal ${goalId} not found for deletion`);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    console.log(`Goal ${goalId} deleted successfully`);
    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error(`Error deleting goal ${goalId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log(`DELETE /api/goals/${goalId} - End`);
  }
}
