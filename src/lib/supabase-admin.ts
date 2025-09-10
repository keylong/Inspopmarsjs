import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('缺少 Supabase 环境变量配置')
}

// 服务端 Supabase 客户端（具有管理员权限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 用户管理辅助函数
export const userAdmin = {
  // 通过用户名查找用户
  async findByUsername(username: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }
    
    return data
  },

  // 通过邮箱查找用户  
  async findByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return data
  },

  // 创建新用户（包含认证和业务数据）
  async createUser(userData: {
    email: string
    password: string
    username: string
    sex?: string | null
    phone?: string | null
    value?: number
    buytype?: number
    buydate?: Date | null
  }) {
    // 创建认证用户
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        username: userData.username,
        name: userData.username
      }
    })

    if (authError) {
      throw authError
    }

    // 创建业务数据
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        username: userData.username,
        sex: userData.sex || null,
        phone: userData.phone || null,
        value: userData.value || 0,
        buytype: userData.buytype || 0,
        buydate: userData.buydate || null,
        name: userData.username
      })
      .select()
      .single()

    if (profileError) {
      // 如果业务数据创建失败，删除已创建的认证用户
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }

    return {
      user: authData.user,
      profile: profileData
    }
  },

  // 更新用户业务数据
  async updateUserProfile(userId: string, updates: Partial<{
    username: string
    sex: string
    phone: string
    value: number
    buytype: number
    buydate: Date
    downloading: string
    account: number
  }>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  // 验证用户凭证（支持邮箱或用户名）
  async verifyCredentials(identifier: string, password: string) {
    let email = identifier

    // 如果不是邮箱格式，则作为用户名查找对应的邮箱
    if (!identifier.includes('@')) {
      const user = await this.findByUsername(identifier)
      if (!user) {
        throw new Error('用户不存在')
      }
      email = user.email
    }

    // 使用 Supabase Auth 验证
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return data
  },

  // 扣除用户使用次数
  async decrementUsage(userId: string, amount: number = 1) {
    // 先获取当前用户信息
    const { data: currentUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('value')
      .eq('id', userId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // 更新使用次数
    const newValue = Math.max(0, currentUser.value - amount)
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        value: newValue,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },

  // 增加用户使用次数（用于充值等场景）
  async incrementUsage(userId: string, amount: number) {
    // 先获取当前用户信息
    const { data: currentUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('value')
      .eq('id', userId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // 更新使用次数
    const newValue = currentUser.value + amount
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        value: newValue,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }
}