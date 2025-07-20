import { getDB } from "../db";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export interface Agent {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "agent";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  _id?: ObjectId;
  agentId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Hash password
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Verify password
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Create a new agent
export async function createAgent(
  agentData: Omit<Agent, "_id" | "passwordHash" | "createdAt" | "updatedAt">,
  password: string,
): Promise<Agent> {
  const db = await getDB();
  const agentsCollection = db.collection("agents");

  const agent: Agent = {
    ...agentData,
    passwordHash: hashPassword(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await agentsCollection.insertOne(agent as any);
  return { ...agent, _id: result.insertedId };
}

// Authenticate agent
export async function authenticateAgent(
  username: string,
  password: string,
): Promise<Agent | null> {
  const db = await getDB();
  const agentsCollection = db.collection("agents");

  const agent = (await agentsCollection.findOne({
    username,
    isActive: true,
  })) as Agent | null;

  if (!agent || !verifyPassword(password, agent.passwordHash)) {
    return null;
  }

  // Update last login
  await agentsCollection.updateOne(
    { _id: agent._id },
    { $set: { lastLogin: new Date(), updatedAt: new Date() } },
  );

  return agent;
}

// Create session
export async function createSession(agentId: ObjectId): Promise<Session> {
  const db = await getDB();
  const sessionsCollection = db.collection("sessions");

  // Clean up expired sessions
  await sessionsCollection.deleteMany({ expiresAt: { $lt: new Date() } });

  const session: Session = {
    agentId,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    createdAt: new Date(),
  };

  const result = await sessionsCollection.insertOne(session as any);
  return { ...session, _id: result.insertedId };
}

// Validate session
export async function validateSession(token: string): Promise<Agent | null> {
  const db = await getDB();
  const sessionsCollection = db.collection("sessions");
  const agentsCollection = db.collection("agents");

  const session = (await sessionsCollection.findOne({
    token,
    expiresAt: { $gt: new Date() },
  })) as Session | null;

  if (!session) {
    return null;
  }

  const agent = (await agentsCollection.findOne({
    _id: session.agentId,
    isActive: true,
  })) as Agent | null;

  return agent;
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<boolean> {
  const db = await getDB();
  const sessionsCollection = db.collection("sessions");

  const result = await sessionsCollection.deleteOne({ token });
  return result.deletedCount === 1;
}

// Get agent by ID
export async function getAgentById(id: string): Promise<Agent | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDB();
  const agentsCollection = db.collection("agents");

  return (await agentsCollection.findOne({
    _id: new ObjectId(id),
  })) as Agent | null;
}
