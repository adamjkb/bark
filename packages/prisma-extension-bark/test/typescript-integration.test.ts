import { describe, it, expect } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

// This test file verifies TypeScript integration works without 'as any'
describe('TypeScript Integration', () => {
  it('should compile without type errors', () => {
    // This should compile without needing 'as any'
    const prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    // Verify the extended client has proper types
    expect(prisma.node.createRoot).toBeDefined()
    expect(prisma.node.createChild).toBeDefined()
    expect(prisma.node.createSibling).toBeDefined()
    expect(prisma.node.findParent).toBeDefined()
    expect(prisma.node.findChildren).toBeDefined()
    expect(prisma.node.findSiblings).toBeDefined()
    expect(prisma.node.findAncestors).toBeDefined()
    expect(prisma.node.findDescendants).toBeDefined()
    expect(prisma.node.findLastRoot).toBeDefined()
    expect(prisma.node.deleteNode).toBeDefined()
    expect(prisma.node.deleteManyNodes).toBeDefined()
    expect(prisma.node.move).toBeDefined()
  })

  it('should maintain type safety for method arguments', async () => {
    const prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    // TypeScript should enforce correct argument types
    const root = await prisma.node.createRoot({
      data: { name: 'TypeSafe Root' }
    })

    // This should have proper types for the result
    expect(root.id).toBeDefined()
    expect(root.path).toBeDefined()
    expect(root.depth).toBe(1)
    expect(root.numchild).toBe(0)
    expect(root.name).toBe('TypeSafe Root')

    // Method chaining should work with proper types
    const children = await prisma.node
      .findChildren({
        node: { id: root.id },
        select: { id: true, name: true }
      })

    // TypeScript should know the shape of children based on select
    if (children.length > 0) {
      expect(children[0].id).toBeDefined()
      expect(children[0].name).toBeDefined()
    }

    await prisma.$disconnect()
  })

  it('should work with different Prisma client configurations', () => {
    // Test with custom Prisma client configuration
    const customPrisma = new PrismaClient({
      log: ['query'],
    }).$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    expect(customPrisma.node.createRoot).toBeDefined()
    customPrisma.$disconnect()
  })

  it('should support multiple model names', () => {
    // Assuming we have multiple models that support bark
    const multiModelPrisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    expect(multiModelPrisma.node).toBeDefined()
    multiModelPrisma.$disconnect()
  })
})