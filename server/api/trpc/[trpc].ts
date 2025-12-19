import { createTRPCNuxtHandler } from 'trpc-nuxt/server'
import { appRouter } from '../../trpc/routers'

export default createTRPCNuxtHandler({
    router: appRouter,
    // createContext: () => ({})
})