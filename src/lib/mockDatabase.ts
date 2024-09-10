import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  status: string;
  roadmap: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Roadmap {
  id: string;
  userId: string;
  goalId: string;
  content: {
    roadmap: string;
    milestones: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface MockDatabaseData {
  users: User[];
  goals: Goal[];
  roadmaps: Roadmap[];
}

class MockDatabase {
  private users: User[] = [];
  private goals: Goal[] = [];
  private roadmaps: Roadmap[] = [];
  private readonly dataFilePath: string;

  constructor() {
    this.dataFilePath = path.join(process.cwd(), 'mock-database.json');
    this.loadData();
  }

  private async loadData() {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const parsedData: MockDatabaseData = JSON.parse(data, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'startDate' || key === 'endDate') {
          return value ? new Date(value) : null;
        }
        return value;
      });
      this.users = parsedData.users;
      this.goals = parsedData.goals;
      this.roadmaps = parsedData.roadmaps;
      console.log('Mock DB: Data loaded successfully');
    } catch (error) {
      console.log('Mock DB: No existing data found, initializing with sample data');
      this.initializeSampleData();
    }
  }

  private initializeSampleData() {
    const sampleUser: User = {
      id: "1",
      email: "demo@example.com",
      name: "Demo User",
      password: "demopassword",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const sampleGoal: Goal = {
      id: uuidv4(),
      userId: "1",
      title: "Sample Goal",
      description: "This is a sample goal",
      startDate: new Date(),
      endDate: null,
      status: "In Progress",
      roadmap: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(sampleUser);
    this.goals.push(sampleGoal);
  }

  private async saveData() {
    const data: MockDatabaseData = {
      users: this.users,
      goals: this.goals,
      roadmaps: this.roadmaps
    };
    await fs.writeFile(this.dataFilePath, JSON.stringify(data, null, 2));
    console.log('Mock DB: Data saved successfully');
  }

  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.users.push(newUser);
    await this.saveData();
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    console.log(`MockDB: Fetching goals for user ${userId}`);
    const userGoals = this.goals.filter(goal => goal.userId === userId);
    console.log(`MockDB: Found ${userGoals.length} goals`);
    return userGoals;
  }

  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    try {
      const newGoal: Goal = {
        id: uuidv4(),
        ...goalData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.goals.push(newGoal);
      console.log(`MockDB: Created new goal:`, newGoal);
      return newGoal;
    } catch (error) {
      console.error('Error in MockDB createGoal:', error);
      throw new Error(`Failed to create goal in mock database: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findGoalById(id: string): Promise<Goal | null> {
    const goal = this.goals.find(g => g.id === id);
    console.log(`MockDB: Finding goal with id ${id}:`, goal || 'Not found');
    return goal || null;
  }

  async updateGoal(id: string, data: Partial<Goal>): Promise<Goal | null> {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) {
      console.log(`MockDB: Goal with id ${id} not found for update`);
      return null;
    }
    this.goals[index] = { ...this.goals[index], ...data, updatedAt: new Date() };
    console.log(`MockDB: Updated goal:`, this.goals[index]);
    await this.saveData();
    return this.goals[index];
  }

  async deleteGoal(id: string): Promise<boolean> {
    const initialLength = this.goals.length;
    this.goals = this.goals.filter(g => g.id !== id);
    const deleted = this.goals.length < initialLength;
    if (deleted) {
      await this.saveData();
    }
    return deleted;
  }

  // Roadmap methods remain the same
  async saveRoadmap(userId: string, goalId: string, roadmapData: { roadmap: string; milestones: string[] }): Promise<Roadmap> {
    const newRoadmap: Roadmap = {
      id: uuidv4(),
      userId,
      goalId,
      content: roadmapData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.roadmaps.push(newRoadmap);
    console.log(`Roadmap saved for user ${userId}, goal ${goalId}`);
    await this.saveData();
    return newRoadmap;
  }

  async getRoadmapByGoalId(userId: string, goalId: string): Promise<Roadmap | null> {
    return this.roadmaps.find(r => r.userId === userId && r.goalId === goalId) || null;
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return this.roadmaps.filter(r => r.userId === userId);
  }

  async updateRoadmap(userId: string, goalId: string, roadmapData: Partial<{ roadmap: string; milestones: string[] }>): Promise<Roadmap | null> {
    const index = this.roadmaps.findIndex(r => r.userId === userId && r.goalId === goalId);
    if (index === -1) return null;

    this.roadmaps[index] = {
      ...this.roadmaps[index],
      content: {
        ...this.roadmaps[index].content,
        ...roadmapData
      },
      updatedAt: new Date()
    };

    console.log(`Roadmap updated for user ${userId}, goal ${goalId}`);
    await this.saveData();
    return this.roadmaps[index];
  }

  async deleteRoadmap(userId: string, goalId: string): Promise<boolean> {
    const initialLength = this.roadmaps.length;
    this.roadmaps = this.roadmaps.filter(r => !(r.userId === userId && r.goalId === goalId));
    const deleted = this.roadmaps.length < initialLength;
    if (deleted) {
      console.log(`Roadmap deleted for user ${userId}, goal ${goalId}`);
      await this.saveData();
    }
    return deleted;
  }
}

export const mockDb = new MockDatabase();