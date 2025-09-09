import { hash } from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import { User, CreateUserData } from '@/types/auth'

// 简单的文件数据库实现 (开发环境使用)
const DB_PATH = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DB_PATH, 'users.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true })
  }
}

// 读取用户数据
async function readUsers(): Promise<User[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// 写入用户数据
async function writeUsers(users: User[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

// 根据邮箱获取用户
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers()
  return users.find(user => user.email === email) || null
}

// 根据ID获取用户
export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsers()
  return users.find(user => user.id === id) || null
}

// 创建新用户
export async function createUser(data: CreateUserData): Promise<User> {
  const users = await readUsers()
  
  // 检查邮箱是否已存在
  const existingUser = users.find(user => user.email === data.email)
  if (existingUser) {
    throw new Error('用户已存在')
  }

  // 生成新用户ID
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  
  const newUser: User = {
    id,
    email: data.email,
    name: data.name,
    avatar: data.avatar || '',
    password: data.password ? await hash(data.password, 12) : '',
    provider: data.provider || 'credentials',
    providerId: data.providerId || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)
  await writeUsers(users)
  
  return newUser
}

// 更新用户信息
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
  const users = await readUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return null
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as User

  await writeUsers(users)
  return users[userIndex]
}

// 删除用户
export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) {
    return false
  }

  users.splice(userIndex, 1)
  await writeUsers(users)
  return true
}