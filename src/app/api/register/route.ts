import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDatabase';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  email: z.string().email('Invalid email address').max(100, 'Email must not exceed 100 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must not exceed 72 characters'),
});

export async function POST(req: NextRequest) {
  console.log('POST /api/register - Start');
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await mockDb.findUserByEmail(email);
    if (existingUser) {
      console.log(`Registration attempt with existing email: ${email}`);
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await mockDb.createUser({
      name,
      email,
      password: hashedPassword,
    });

    console.log(`User registered successfully: ${user.id}`);
    return NextResponse.json({ message: 'User registered successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error during registration:', error.errors);
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Unexpected error during registration:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  } finally {
    console.log('POST /api/register - End');
  }
}