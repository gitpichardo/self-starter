import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/mockDatabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const existingUser = await mockDb.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await mockDb.createUser({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Error in signup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}