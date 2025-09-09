'use client'

import { UserButton } from '@stackframe/stack'

export function StackUserButton() {
  return (
    <UserButton 
      // 自定义样式
      className="inline-flex"
      // 显示用户菜单项
      showSignOutButton
    />
  )
}