// 结合drizzle，写一个trpc的登录注册的路由。
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      username: z.string().min(3, '用户名至少3个字符'),
      password: z.string().min(6, '密码至少6个字符')
    }))
    .mutation(async ({ input }) => {
      // 检查用户名是否已存在
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, input.username))
        .get()
      
      if (existingUser) {
        throw new Error('用户名已存在')
      }
      
      // 密码不应显式存放在数据库，应用哈希加密后存储
      const hashedPassword = await bcrypt.hash(input.password, 10)

      const newUser = await db.insert(users).values({
        username: input.username,
        password: hashedPassword
      }).returning().get()
      
      return {
        success: true,
        message: '注册成功',
        user: {
          id: newUser.id,
          username: newUser.username
        }
      }
    }),
    
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const user = await db.select()
        .from(users)
        .where(eq(users.username, input.username))
        .get()
      
      if (!user) {
        throw new Error('用户不存在')
      }
      
      // 验证密码
      const isValidPassword = await bcrypt.compare(input.password, user.password)
      
      if (!isValidPassword) {
        throw new Error('密码错误')
      }
      // 箭头函数返回值，类型由推断得出
      return {
        success: true,
        message: '登录成功',
        user: {
          id: user.id,
          username: user.username
        }
      }
    }),
})