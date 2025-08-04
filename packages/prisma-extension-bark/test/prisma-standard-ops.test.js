import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

describe('Prisma Standard Operations Compatibility', () => {
  let prisma
  let testNodeIds = []

  beforeEach(() => {
    // Fresh client for each test
    prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )
    testNodeIds = []
  })

  afterEach(async () => {
    // Clean up any test nodes created
    if (testNodeIds.length > 0) {
      await prisma.node.deleteMany({
        where: { id: { in: testNodeIds } }
      })
    }
    await prisma.$disconnect()
  })

  it('should support findMany with ordering and filtering', async () => {
    // Create test nodes with unique paths
    const timestamp = Date.now()
    const nodes = await Promise.all([
      prisma.node.create({
        data: {
          name: 'Test Node A',
          path: `A${timestamp}01`,
          depth: 2,
          numchild: 0
        }
      }),
      prisma.node.create({
        data: {
          name: 'Test Node B',
          path: `A${timestamp}02`,
          depth: 2,
          numchild: 0
        }
      }),
      prisma.node.create({
        data: {
          name: 'Test Node C',
          path: `A${timestamp}03`,
          depth: 3,
          numchild: 0
        }
      })
    ])
    testNodeIds.push(...nodes.map(n => n.id))

    // Test findMany with where and orderBy
    const found = await prisma.node.findMany({
      where: { 
        depth: 2,
        path: { startsWith: `A${timestamp}` }
      },
      orderBy: { path: 'desc' }
    })

    expect(found).toHaveLength(2)
    expect(found[0].name).toBe('Test Node B')
    expect(found[1].name).toBe('Test Node A')
  })

  it('should support findUnique with select', async () => {
    const timestamp = Date.now()
    const node = await prisma.node.create({
      data: {
        name: 'Select Test',
        path: `SEL${timestamp}`,
        depth: 1,
        numchild: 0
      }
    })
    testNodeIds.push(node.id)

    const selected = await prisma.node.findUnique({
      where: { id: node.id },
      select: {
        name: true,
        path: true
      }
    })

    expect(selected).toEqual({
      name: 'Select Test',
      path: `SEL${timestamp}`
    })
    expect(selected.id).toBeUndefined()
    expect(selected.depth).toBeUndefined()
  })

  it('should support upsert operation', async () => {
    const timestamp = Date.now()
    const uniquePath = `UPS${timestamp}`

    // First upsert - should create
    const created = await prisma.node.upsert({
      where: { path: uniquePath },
      update: { name: 'Updated' },
      create: {
        name: 'Created',
        path: uniquePath,
        depth: 1,
        numchild: 0
      }
    })

    expect(created.name).toBe('Created')
    testNodeIds.push(created.id)

    // Second upsert - should update
    const updated = await prisma.node.upsert({
      where: { path: uniquePath },
      update: { name: 'Updated' },
      create: {
        name: 'Should not create',
        path: uniquePath,
        depth: 1,
        numchild: 0
      }
    })

    expect(updated.id).toBe(created.id)
    expect(updated.name).toBe('Updated')
  })

  it('should work with Bark methods in the same query chain', async () => {
    // First, use standard Prisma to check if any roots exist
    const existingCount = await prisma.node.count({
      where: { depth: 1 }
    })

    // Create a root using Bark
    const root = await prisma.node.createRoot({
      data: { name: `Compatibility Test Root ${Date.now()}` }
    })
    testNodeIds.push(root.id)

    // Verify count increased
    const newCount = await prisma.node.count({
      where: { depth: 1 }
    })
    expect(newCount).toBe(existingCount + 1)

    // Create children using Bark
    const child1 = await prisma.node.createChild({
      node: { id: root.id },
      data: { name: 'Child 1' }
    })
    const child2 = await prisma.node.createChild({
      node: { id: root.id },
      data: { name: 'Child 2' }
    })
    testNodeIds.push(child1.id, child2.id)

    // Use standard Prisma to find all children
    const children = await prisma.node.findMany({
      where: {
        path: {
          startsWith: root.path,
          not: root.path
        }
      },
      orderBy: { path: 'asc' }
    })

    expect(children).toHaveLength(2)
    expect(children[0].name).toBe('Child 1')
    expect(children[1].name).toBe('Child 2')
  })

  it('should support groupBy operations', async () => {
    const timestamp = Date.now()
    
    // Create nodes at different depths
    const nodes = await Promise.all([
      prisma.node.create({
        data: { name: 'Group 1', path: `G${timestamp}01`, depth: 1, numchild: 2 }
      }),
      prisma.node.create({
        data: { name: 'Group 2', path: `G${timestamp}02`, depth: 1, numchild: 3 }
      }),
      prisma.node.create({
        data: { name: 'Group 3', path: `G${timestamp}03`, depth: 2, numchild: 0 }
      })
    ])
    testNodeIds.push(...nodes.map(n => n.id))

    const grouped = await prisma.node.groupBy({
      by: ['depth'],
      where: {
        path: { startsWith: `G${timestamp}` }
      },
      _count: true,
      _sum: { numchild: true },
      _avg: { numchild: true }
    })

    const depth1Group = grouped.find(g => g.depth === 1)
    expect(depth1Group?._count).toBe(2)
    expect(depth1Group?._sum.numchild).toBe(5)
    expect(depth1Group?._avg.numchild).toBe(2.5)
  })

  it('should support transactions mixing Bark and Prisma operations', async () => {
    const result = await prisma.$transaction(async (tx) => {
      // Create root with Bark
      const root = await tx.node.createRoot({
        data: { name: `Transaction Test ${Date.now()}` }
      })

      // Update with standard Prisma
      const updatedRoot = await tx.node.update({
        where: { id: root.id },
        data: { name: 'Updated Root Name' }
      })

      // Create a child node using standard Prisma (not Bark)
      const childPath = root.path + '0001'
      const child1 = await tx.node.create({
        data: {
          name: 'TX Child 1',
          path: childPath,
          depth: root.depth + 1,
          numchild: 0
        }
      })

      // Update parent's numchild
      await tx.node.update({
        where: { id: root.id },
        data: { numchild: 1 }
      })

      // Find with standard Prisma
      const allNodes = await tx.node.findMany({
        where: {
          path: { startsWith: root.path }
        },
        orderBy: { path: 'asc' }
      })

      return { root: updatedRoot, child1, allNodes }
    })

    testNodeIds.push(result.root.id, result.child1.id)
    expect(result.allNodes).toHaveLength(2)
    expect(result.root.name).toBe('Updated Root Name')
  })

  it('should preserve all standard Prisma query capabilities', async () => {
    const timestamp = Date.now()
    
    // Complex query with multiple conditions
    const node = await prisma.node.create({
      data: {
        name: 'Complex Query Test',
        path: `CQ${timestamp}`,
        depth: 5,
        numchild: 10
      }
    })
    testNodeIds.push(node.id)

    // Test various query operators
    const found = await prisma.node.findFirst({
      where: {
        AND: [
          { depth: { gte: 5 } },
          { numchild: { lt: 20 } },
          { path: { contains: timestamp.toString() } }
        ]
      }
    })

    expect(found?.id).toBe(node.id)

    // Test NOT operator
    const notFound = await prisma.node.findMany({
      where: {
        NOT: {
          id: node.id
        },
        path: { startsWith: `CQ${timestamp}` }
      }
    })

    expect(notFound).toHaveLength(0)
  })
})