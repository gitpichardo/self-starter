import { User, Goal, Habit, JournalEntry, VisionBoard } from '@prisma/client'

class MockDatabase {
  private users: User[] = []
  private goals: Goal[] = []
  private habits: Habit[] = []
  private journalEntries: JournalEntry[] = []
  private visionBoards: VisionBoard[] = []

  // User methods
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.push(newUser)
    return newUser
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null
  }

  // Goal methods
  async createGoal(data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const newGoal: Goal = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.goals.push(newGoal)
    return newGoal
  }

  async findGoalsByUserId(userId: string): Promise<Goal[]> {
    return this.goals.filter(goal => goal.userId === userId)
  }

  // Implement other methods for Habit, JournalEntry, VisionBoard

  // Utility method to clear all data (useful for testing)
  clearAll() {
    this.users = []
    this.goals = []
    this.habits = []
    this.journalEntries = []
    this.visionBoards = []
  }
}

export const mockDb = new MockDatabase()


