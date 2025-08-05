import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from '../src/index.js'

describe('Prisma Standard Functions Compatibility', () => {
  let prisma
  let testNodes = []

  beforeAll(() => {
    // Initialize Prisma with Bark extension
    prisma = new PrismaClient().$extends(
      withBark({ modelNames: ['node'] })(Prisma)
    )
  })

  afterAll(async () => {
    // Clean up test data
    if (testNodes.length > 0) {
      await prisma.node.deleteMany({
        where: {
          id: { in: testNodes.map(n => n.id) }
        }
      })
    }
    await prisma.$disconnect()
  })

  describe('Standard Prisma CRUD Operations', () => {
    it('should support standard create operation', async () => {
      const node = await prisma.node.create({
        data: {
          name: 'Standard Create Test',
          path: 'TEST0001',
          depth: 1,
          numchild: 0
        }
      })

      expect(node).toMatchObject({
        name: 'Standard Create Test',
        path: 'TEST0001',
        depth: 1,
        numchild: 0
      })

      testNodes.push(node)
    })

    it('should support findUnique operation', async () => {
      // Create a node first
      const created = await prisma.node.create({
        data: {
          name: 'Find Unique Test',
          path: 'TEST0002',
          depth: 1,
          numchild: 0
        }
      })
      testNodes.push(created)

      // Find it using findUnique
      const found = await prisma.node.findUnique({
        where: { id: created.id }
      })

      expect(found).toMatchObject({
        id: created.id,
        name: 'Find Unique Test',
        path: 'TEST0002'
      })
    })

    it('should support findFirst operation', async () => {
      const created = await prisma.node.create({
        data: {
          name: 'Find First Test',
          path: 'TEST0003',
          depth: 2,
          numchild: 0
        }
      })
      testNodes.push(created)

      const found = await prisma.node.findFirst({
        where: { 
          name: 'Find First Test',
          depth: 2
        }
      })

      expect(found?.id).toBe(created.id)
    })

    it('should support findMany operation', async () => {
      // Create multiple nodes
      const nodes = await Promise.all([
        prisma.node.create({
          data: {
            name: 'Find Many 1',
            path: 'TEST0004',
            depth: 3,
            numchild: 0
          }
        }),
        prisma.node.create({
          data: {
            name: 'Find Many 2',
            path: 'TEST0005',
            depth: 3,
            numchild: 0
          }
        })
      ])
      testNodes.push(...nodes)

      const found = await prisma.node.findMany({
        where: { depth: 3 },
        orderBy: { path: 'asc' }
      })

      expect(found.length).toBeGreaterThanOrEqual(2)
      expect(found.some(n => n.name === 'Find Many 1')).toBe(true)
      expect(found.some(n => n.name === 'Find Many 2')).toBe(true)
    })

    it('should support update operation', async () => {
      const created = await prisma.node.create({
        data: {
          name: 'Update Test',
          path: 'TEST0006',
          depth: 1,
          numchild: 0
        }
      })
      testNodes.push(created)

      const updated = await prisma.node.update({
        where: { id: created.id },
        data: { name: 'Updated Name' }
      })

      expect(updated.name).toBe('Updated Name')
      expect(updated.id).toBe(created.id)
    })

    it('should support updateMany operation', async () => {
      const nodes = await Promise.all([
        prisma.node.create({
          data: {
            name: 'Update Many Test',
            path: 'TEST0007',
            depth: 4,
            numchild: 0
          }
        }),
        prisma.node.create({
          data: {
            name: 'Update Many Test',
            path: 'TEST0008',
            depth: 4,
            numchild: 0
          }
        })
      ])
      testNodes.push(...nodes)

      const result = await prisma.node.updateMany({
        where: { 
          name: 'Update Many Test',
          depth: 4
        },
        data: { name: 'Bulk Updated' }
      })

      expect(result.count).toBeGreaterThanOrEqual(2)
    })

    it('should support delete operation', async () => {
      const created = await prisma.node.create({
        data: {
          name: 'Delete Test',
          path: 'TEST0009',
          depth: 1,
          numchild: 0
        }
      })

      const deleted = await prisma.node.delete({
        where: { id: created.id }
      })

      expect(deleted.id).toBe(created.id)

      // Verify it's deleted
      const found = await prisma.node.findUnique({
        where: { id: created.id }
      })
      expect(found).toBeNull()
    })

    it('should support deleteMany operation', async () => {
      const nodes = await Promise.all([
        prisma.node.create({
          data: {
            name: 'Delete Many Test',
            path: 'TEST0010',
            depth: 5,
            numchild: 0
          }
        }),
        prisma.node.create({
          data: {
            name: 'Delete Many Test',
            path: 'TEST0011',
            depth: 5,
            numchild: 0
          }
        })
      ])

      const result = await prisma.node.deleteMany({
        where: { 
          name: 'Delete Many Test',
          depth: 5
        }
      })

      expect(result.count).toBeGreaterThanOrEqual(2)
    })

    it('should support count operation', async () => {
      const created = await prisma.node.create({
        data: {
          name: 'Count Test',
          path: 'TEST0012',
          depth: 6,
          numchild: 0
        }
      })
      testNodes.push(created)

      const count = await prisma.node.count({
        where: { depth: 6 }
      })

      expect(count).toBeGreaterThanOrEqual(1)
    })

    it('should support aggregate operations', async () => {
      const created = await prisma.node.create({
        data: {
          name: 'Aggregate Test',
          path: 'TEST0013',
          depth: 7,
          numchild: 3
        }
      })
      testNodes.push(created)

      const result = await prisma.node.aggregate({
        where: { depth: 7 },
        _avg: { numchild: true },
        _max: { numchild: true },
        _min: { numchild: true }
      })

      expect(result._max.numchild).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Prisma and Bark Methods Together', () => {
    it('should allow using Prisma and Bark methods on same model', async () => {
      // Use Bark method to create a root
      const timestamp = Date.now()
      const root = await prisma.node.createRoot({
        data: { name: `Mixed Methods Root ${timestamp}` }
      })
      testNodes.push(root)

      // Use standard Prisma to find it
      const found = await prisma.node.findUnique({
        where: { id: root.id }
      })

      expect(found?.name).toBe('Mixed Methods Root')

      // Use Bark method to create a child
      const child = await prisma.node.createChild({
        node: { id: root.id },
        data: { name: 'Mixed Methods Child' }
      })
      testNodes.push(child)

      // Use standard Prisma to update it
      const updated = await prisma.node.update({
        where: { id: child.id },
        data: { name: 'Updated Child Name' }
      })

      expect(updated.name).toBe('Updated Child Name')

      // Use Bark method to find children
      const children = await prisma.node.findChildren({
        node: { id: root.id }
      })

      expect(children).toHaveLength(1)
      expect(children[0].name).toBe('Updated Child Name')
    })

    it('should support transactions with both Prisma and Bark methods', async () => {
      const result = await prisma.$transaction(async (tx) => {
        // Bark method
        const root = await tx.node.createRoot({
          data: { name: 'Transaction Mixed Root' }
        })

        // Standard Prisma method
        const updated = await tx.node.update({
          where: { id: root.id },
          data: { name: 'Transaction Updated Root' }
        })

        // Bark method
        const child = await tx.node.createChild({
          node: { id: root.id },
          data: { name: 'Transaction Child' }
        })

        // Standard Prisma method
        const count = await tx.node.count({
          where: {
            path: { startsWith: root.path }
          }
        })

        return { root: updated, child, count }
      })

      expect(result.root.name).toBe('Transaction Updated Root')
      expect(result.child.name).toBe('Transaction Child')
      expect(result.count).toBe(2) // root + child

      // Clean up
      testNodes.push(result.root, result.child)
    })

    it('should maintain select and include functionality', async () => {
      const root = await prisma.node.createRoot({
        data: { name: 'Select Test Root' },
        select: {
          id: true,
          name: true,
          path: true
        }
      })
      testNodes.push(root)

      expect(root).toHaveProperty('id')
      expect(root).toHaveProperty('name')
      expect(root).toHaveProperty('path')
      // Should not have other fields when using select
      expect(root).not.toHaveProperty('created_at')

      // Standard Prisma with select
      const found = await prisma.node.findUnique({
        where: { id: root.id },
        select: {
          name: true,
          depth: true
        }
      })

      expect(found).toHaveProperty('name')
      expect(found).toHaveProperty('depth')
      expect(found).not.toHaveProperty('id')
    })

    it('should support where conditions with Bark methods', async () => {
      const root = await prisma.node.createRoot({
        data: { name: 'Where Test Root' }
      })
      testNodes.push(root)

      const children = await Promise.all([
        prisma.node.createChild({
          node: { id: root.id },
          data: { name: 'Active Child' }
        }),
        prisma.node.createChild({
          node: { id: root.id },
          data: { name: 'Inactive Child' }
        })
      ])
      testNodes.push(...children)

      // Find children with additional where conditions
      const activeChildren = await prisma.node.findChildren({
        node: { id: root.id },
        where: { name: { contains: 'Active' } }
      })

      expect(activeChildren).toHaveLength(1)
      expect(activeChildren[0].name).toBe('Active Child')
    })
  })
})