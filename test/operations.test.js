import { PrismaClient } from '@prisma/client'
import { bark } from '../src'
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './setup/seed'

const prisma = new PrismaClient().$extends(bark)

describe('move()', async () => {
	const rootNode = await prisma.node.findUniqueOrThrow({ where: { id: 1 } })
	const homeNode = await prisma.node.findUniqueOrThrow({ where: { id: 2 } })

	/* Home nodes */
	// it('wip', async () => {
	// 	// await prisma.node.move({node: homeNode, position: 'first-sibling', reference: { node: rootNode }})
	// 	expect(true).toBe(true)
	// })

	it('Simple last sibling', async () => {
		const a_c_Node = await prisma.node.findUniqueOrThrow({ where: { id: 8 } })
		const a_a_Node = await prisma.node.findUniqueOrThrow({ where: { id: 6 } })

		await prisma.node.move({ node: a_c_Node, position: 'last-sibling', reference: { node: a_a_Node } })


		const result = await prisma.node.findUniqueOrThrow({ where: { id: 8 }, select: { path: true, depth: true, numchild: true } })

		expect(result).toStrictEqual({ path: '0001000100010006', depth: a_c_Node.depth, numchild: a_c_Node.numchild })
	})

	afterEach(async () => {
		await seedOrResetDB()
	})
})
