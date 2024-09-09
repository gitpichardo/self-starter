import { User, Goal } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

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
      console.log('Mock DB: No existing data found, initializing with empty state');
      // Initialize with default data if file doesn't exist
      this.goals = [
        {
          id: '87138860-0cea-4cfe-b973-2dfb8a1e5c1a',
          createdAt: new Date('2024-09-09T21:40:56.386Z'),
          updatedAt: new Date('2024-09-09T21:40:56.386Z'),
          title: 'Run a 30 k',
          description: 'Learn to run a 30K',
          startDate: new Date('2024-09-10T00:00:00.000Z'),
          endDate: null,
          status: 'Not Started',
          userId: '1725903710187',
          roadmap: null
        }
      ];
    }
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

  async createGoal(data: Omit<Goal, "id" | "createdAt" | "updatedAt">): Promise<Goal> {
    const newGoal: Goal = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.goals.push(newGoal);
    console.log('Mock DB: Created new goal:', newGoal);
    await this.saveData();
    return newGoal;
  }

  async findGoalById(id: string): Promise<Goal | null> {
    console.log('Mock DB: All goals:', this.goals);
    const goal = this.goals.find(g => g.id === id);
    console.log(`Mock DB: Finding goal with id ${id}:`, goal || 'Not found');
    return goal || null;
  }

  async updateGoal(id: string, data: Partial<Goal>): Promise<Goal | null> {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) {
      console.log(`Mock DB: Goal with id ${id} not found for update`);
      return null;
    }
    this.goals[index] = { ...this.goals[index], ...data, updatedAt: new Date() };
    console.log(`Mock DB: Updated goal:`, this.goals[index]);
    await this.saveData();
    return this.goals[index];
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    console.log(`Fetching goals for user: ${userId}`);
    const userGoals = this.goals.filter(goal => goal.userId === userId);
    console.log(`Found ${userGoals.length} goals for user ${userId}`);
    return userGoals;
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

  async addMockGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const newGoal: Goal = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...goal
    };
    this.goals.push(newGoal);
    console.log(`Added mock goal: ${newGoal.id} for user: ${newGoal.userId}`);
    await this.saveData();
    return newGoal;
  }
  
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
    const roadmap = this.roadmaps.find(r => r.userId === userId && r.goalId === goalId);
    return roadmap || null;
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