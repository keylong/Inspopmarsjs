// 用户基础信息
export interface User {
  id: string
  email: string
  name: string
  avatar: string
  password: string
  provider: 'credentials' | 'google' | 'github'
  providerId: string
  createdAt: string
  updatedAt: string
}

// 创建用户数据
export interface CreateUserData {
  email: string
  name: string
  password?: string
  avatar?: string
  provider?: 'credentials' | 'google' | 'github'
  providerId?: string
}

// 登录表单数据
export interface SignInData {
  email: string
  password: string
}

// 注册表单数据
export interface SignUpData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

// 用户资料更新数据
export interface UpdateProfileData {
  name?: string
  avatar?: string
}

// 密码更新数据
export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// API 响应类型
export interface AuthResponse {
  success: boolean
  message: string
  user?: Omit<User, 'password'>
  error?: string
}

// 会话状态
export interface SessionUser {
  id: string
  email: string
  name: string
  image?: string
}

// NextAuth 扩展类型
declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    email: string
    name: string
    avatar?: string
  }
}