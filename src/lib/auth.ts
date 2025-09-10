import { createServerSupabaseClient } from './supabase-server'
import { prisma } from './prisma'
import { hash, compare } from 'bcryptjs'

export interface User {
  id: string
  email: string | null
  name: string | null
  image: string | null
}

export interface CreateUserData {
  email: string
  password?: string
  name?: string
  provider?: string
  providerId?: string
}

// 使用 Prisma 获取用户
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        password: true,
      }
    })
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      }
    })
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

// 创建新用户（使用 Prisma）
export async function createUser(data: CreateUserData) {
  try {
    const hashedPassword = data.password ? await hash(data.password, 12) : null
    
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        password: hashedPassword,
        // 其他字段使用默认值
      }
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    throw new Error('创建用户失败')
  }
}

// 验证用户密码
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await compare(plainPassword, hashedPassword)
}

// 获取当前会话用户 (使用 Supabase Auth)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    
    if (error || !authUser) {
      return null
    }
    
    // 从 Prisma 获取用户详细信息
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      }
    })
    
    return user
  } catch (error) {
    console.error('获取当前用户失败:', error)
    return null
  }
}