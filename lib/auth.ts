import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  createdAt: string;
}

class UserStore {
  private users: User[] = [];
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'users.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.users = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  async create(email: string, password: string): Promise<UserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(user);
    this.saveToDisk();
    
    return this.removePassword(user);
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;
    
    return bcrypt.compare(password, user.password);
  }

  removePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userStore = new UserStore();

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
