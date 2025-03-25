import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'administrator' | 'agent' | 'guide' | 'marketing' | 'support';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  _id?: ObjectId;
  username: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: Date | null;
} 