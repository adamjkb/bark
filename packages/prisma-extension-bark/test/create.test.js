
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed.js'
import { get_a_a_node, get_a_node, prisma } from './utilities/prisma.js'

describe('createRoot()', async () => {
	it('has root nodes already', async () => {
		const result = await prisma.node.createRoot({ data: { name: 'Root 2' }, select: { path: true, name: true } })
		expect(result).toStrictEqual({ path: '0002', name: 'Root 2' })
	})

	it('has no root', async () => {
		// Setup: Delete all data
		await prisma.node.deleteMany({})

		const result = await prisma.node.createRoot({ select: { path: true } })
		expect(result).toStrictEqual({ path: '0001' })
	})

	afterEach(seedOrResetDB)
})

describe('createChild()', async () => {
	it('first born', async () => {
		const node = await get_a_a_node()

		const result = await prisma.node.createChild({ node, data: { name: 'A-A-A' }, select: { path: true, numchild: true, depth: true } })

		// New born child
		expect(result).toStrictEqual({ depth: node.depth + 1, numchild: 0, path: '00010001000100010001' })
		// New parent
		const new_node = await get_a_a_node()
		expect(new_node).toStrictEqual({...node, numchild: node.numchild + 1 })
	})

	it('had kids before', async () => {
		const node = await get_a_node()

		const result = await prisma.node.createChild({ node: { id: node.id }, select: { path: true, numchild: true, depth: true } })

		// New born child
		expect(result).toStrictEqual({ depth: node.depth + 1, numchild: 0, path: '0001000100010006' })
		// Parent
		const new_node = await get_a_node()
		expect(new_node).toStrictEqual({ ...node, numchild: node.numchild + 1 })
	})

	afterEach(seedOrResetDB)
})

describe('createSibling()', async () => {
	it('w/ select', async () => {
		const node = await get_a_a_node()
		const parent_node_before = await get_a_node()

		const result = await prisma.node.createSibling({ node, data: { name: 'A-F' }, select: { path: true, numchild: true, depth: true } })

		// New born child
		expect(result).toStrictEqual({ depth: node.depth, numchild: 0, path: '0001000100010006' })
		// Updated parent
		const parent_node_after = await get_a_node()
		expect(parent_node_after).toStrictEqual({ ...parent_node_before, numchild: parent_node_before.numchild + 1 })
	})

	it('w/ node query', async () => {
		const node = await get_a_a_node()
		const parent_node_before = await get_a_node()

		const result = await prisma.node.createSibling({ node: { id: node.id } })

		// New born child
		expect(result.path).toBe('0001000100010006')
		// Updated parent
		const parent_node_after = await get_a_node()
		expect(parent_node_after).toStrictEqual({ ...parent_node_before, numchild: parent_node_before.numchild + 1 })
	})

	afterEach(seedOrResetDB)
})
