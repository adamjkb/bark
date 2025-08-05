import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

describe('Custom Prisma Path Integration', () => {
  let prisma

  beforeAll(() => {
    // Test that withBark works with Prisma namespace parameter
    prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )
  })

  it('should initialize extension with Prisma namespace parameter', () => {
    expect(prisma).toBeDefined()
    expect(prisma.node.createRoot).toBeDefined()
    expect(prisma.node.createChild).toBeDefined()
    expect(prisma.node.findChildren).toBeDefined()
  })

  it('should create root node using custom Prisma path', async () => {
    const root = await prisma.node.createRoot({
      data: { name: 'Custom Path Root' }
    })

    expect(root).toMatchObject({
      name: 'Custom Path Root',
      path: expect.stringMatching(/^[0-9A-Z]{4}$/),
      depth: 1,
      numchild: 0
    })
  })

  it('should handle all CRUD operations with custom path', async () => {
    // Create a root
    const root = await prisma.node.createRoot({
      data: { name: 'Test Root' }
    })

    // Create a child
    const child = await prisma.node.createChild({
      node: { id: root.id },
      data: { name: 'Test Child' }
    })

    expect(child.path.startsWith(root.path)).toBe(true)
    expect(child.depth).toBe(root.depth + 1)

    // Find children
    const children = await prisma.node.findChildren({
      node: { id: root.id }
    })

    expect(children).toHaveLength(1)
    expect(children[0].id).toBe(child.id)

    // Create sibling
    const sibling = await prisma.node.createSibling({
      node: { id: child.id },
      data: { name: 'Test Sibling' }
    })

    expect(sibling.depth).toBe(child.depth)
    expect(sibling.path).not.toBe(child.path)

    // Find parent
    const parent = await prisma.node.findParent({
      node: { id: child.id }
    })

    expect(parent.id).toBe(root.id)

    // Delete node
    const deleted = await prisma.node.deleteNode({
      node: { id: child.id }
    })

    expect(deleted.count).toBeGreaterThan(0)
  })

  it('should work with transactions', { timeout: 10000 }, async () => {
    const result = await prisma.$transaction(async (tx) => {
      const root = await tx.node.createRoot({
        data: { name: 'Transaction Root' }
      })

      const child1 = await tx.node.createChild({
        node: { id: root.id },
        data: { name: 'Transaction Child 1' }
      })

      const child2 = await tx.node.createChild({
        node: { id: root.id },
        data: { name: 'Transaction Child 2' }
      })

      return { root, child1, child2 }
    })

    expect(result.root).toBeDefined()
    expect(result.child1.path.startsWith(result.root.path)).toBe(true)
    expect(result.child2.path.startsWith(result.root.path)).toBe(true)
    expect(result.child1.path).not.toBe(result.child2.path)
  })

  it('should handle complex tree operations', async () => {
    // Create a tree structure
    const root = await prisma.node.createRoot({
      data: { name: 'Company' }
    })

    const dept1 = await prisma.node.createChild({
      node: { id: root.id },
      data: { name: 'Engineering' }
    })

    const dept2 = await prisma.node.createChild({
      node: { id: root.id },
      data: { name: 'Marketing' }
    })

    const team1 = await prisma.node.createChild({
      node: { id: dept1.id },
      data: { name: 'Backend Team' }
    })

    const team2 = await prisma.node.createChild({
      node: { id: dept1.id },
      data: { name: 'Frontend Team' }
    })

    // Find all descendants of Engineering
    const engDescendants = await prisma.node.findDescendants({
      node: { id: dept1.id }
    })

    expect(engDescendants).toHaveLength(2)
    expect(engDescendants.map(n => n.name)).toContain('Backend Team')
    expect(engDescendants.map(n => n.name)).toContain('Frontend Team')

    // Find ancestors of Backend Team
    const ancestors = await prisma.node.findAncestors({
      node: { id: team1.id }
    })

    expect(ancestors).toHaveLength(2)
    expect(ancestors.map(n => n.name)).toContain('Company')
    expect(ancestors.map(n => n.name)).toContain('Engineering')

    // Move Backend Team to Marketing
    await prisma.node.move({
      node: { id: team1.id },
      referenceNode: { id: dept2.id },
      position: 'child'
    })

    // Verify move
    const movedTeam = await prisma.node.findUnique({
      where: { id: team1.id }
    })

    const movedTeamParent = await prisma.node.findParent({
      node: { id: team1.id }
    })

    expect(movedTeamParent?.id).toBe(dept2.id)
    expect(movedTeamParent?.name).toBe('Marketing')
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.node.deleteMany()
    await prisma.$disconnect()
  })
})