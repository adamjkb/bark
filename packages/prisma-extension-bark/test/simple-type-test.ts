// Simple test to verify the types work
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

// This should work without 'as any'
const prisma = new PrismaClient().$extends(
  withBark({ modelNames: ['node'] })(Prisma)
)

// Test that the types are recognized
const test = async () => {
  // These should have proper TypeScript support
  const root = await prisma.node.createRoot({
    data: { name: 'Test' }
  })
  
  console.log('Types work correctly:', root.id, root.path)
}

test()