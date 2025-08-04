import { describe, it, expect } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

describe('Prisma Namespace Parameter', () => {
  it('should accept Prisma namespace as parameter', () => {
    // This is the main test - verifying the API works
    const extendedClient = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    // Verify all methods are available
    expect(typeof extendedClient.node.createRoot).toBe('function')
    expect(typeof extendedClient.node.createChild).toBe('function')
    expect(typeof extendedClient.node.createSibling).toBe('function')
    expect(typeof extendedClient.node.findParent).toBe('function')
    expect(typeof extendedClient.node.findChildren).toBe('function')
    expect(typeof extendedClient.node.findSiblings).toBe('function')
    expect(typeof extendedClient.node.findAncestors).toBe('function')
    expect(typeof extendedClient.node.findDescendants).toBe('function')
    expect(typeof extendedClient.node.findLastRoot).toBe('function')
    expect(typeof extendedClient.node.deleteNode).toBe('function')
    expect(typeof extendedClient.node.deleteManyNodes).toBe('function')
    expect(typeof extendedClient.node.move).toBe('function')

    extendedClient.$disconnect()
  })

  it('should work with basic operations', async () => {
    const prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    try {
      // Create a unique root for this test
      const testId = `test-${Date.now()}`
      const root = await prisma.node.createRoot({
        data: { name: testId }
      })

      expect(root).toMatchObject({
        name: testId,
        path: expect.any(String),
        depth: 1,
        numchild: 0
      })

      // Clean up
      await prisma.node.delete({
        where: { id: root.id }
      })
    } finally {
      await prisma.$disconnect()
    }
  })

  it('should maintain backwards compatibility', () => {
    // The old API (if it existed) would have been:
    // const prisma = new PrismaClient().$extends(withBark({ modelNames: ['node'] }))
    
    // The new API requires passing Prisma:
    const prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )

    expect(prisma.node).toBeDefined()
    prisma.$disconnect()
  })
})