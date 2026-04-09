import fs from "fs";
import path from "path";

type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string | null;
};

const DATA_DIR = path.resolve(process.cwd(), "src", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataFile() {
  try {
    await fs.promises.access(DATA_DIR);
  } catch {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.promises.access(USERS_FILE);
  } catch {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify([]), "utf8");
  }
}

async function readUsers(): Promise<User[]> {
  await ensureDataFile();
  const raw = await fs.promises.readFile(USERS_FILE, "utf8");
  try {
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await ensureDataFile();
  await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(data: { name: string; email: string; password?: string }) {
  const users = await readUsers();
  const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const user: User = { id, name: data.name, email: data.email.toLowerCase(), password: data.password };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function countUsers() {
  const users = await readUsers();
  return users.length;
}

export default { findUserByEmail, createUser, countUsers };
