//在这里初始化主路由器实例，通常称为 appRouter 。然后我们需要导出一会儿将在客户端使用的路由器类型

import { router } from '../trpc'
import { authRouter } from './auth'

export const appRouter = router({
    auth: authRouter,
})

export type AppRouter = typeof appRouter