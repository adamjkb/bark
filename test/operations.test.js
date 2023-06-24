import { PrismaClient } from '@prisma/client'
import { bark } from '../src'
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './setup/seed'

const prisma = new PrismaClient().$extends(bark)
const get_a_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 3 } })
const get_b_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 4 } })
const get_c_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 5 } })
const get_a_a_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 6 } })
const get_a_b_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 7 } })
const get_a_c_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 8 } })
const get_a_d_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 9 } })
const get_a_e_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 10 } })
const get_b_a_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 11 } })

const resetDb = async () => await seedOrResetDB()

// Position: last-sibling
describe('Operation: move(), Position: last-sibling', async () => {
	it('last-sibling — same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_a_node()

		await prisma.node.move({ node: node, position: 'last-sibling', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth, numchild: node.numchild })
	})

	it('last-sibling — same level, descendants', async () => {
		const node = await get_a_node()
		const reference_node = await get_c_node()
		await prisma.node.move({ node: node, position: 'last-sibling', reference: { node: reference_node } })

		const result = await get_a_node()
		expect(result).toMatchObject({ path: '000100010004', depth: node.depth, numchild: node.numchild })
		const result_child = await get_a_a_node()
		expect(result_child).toMatchObject({ path: '0001000100040001' })
	})

	afterEach(resetDb)
})

// Position: right
describe('Operation: move(), Position: right', async () => {
	it('right (reference node is last-sibling) — same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_e_node()

		await prisma.node.move({ node: node, position: 'right', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth, numchild: node.numchild })
	})

	it('right (reference node is last-sibling) — same level, descendants', async () => {
		const node = await get_a_node()
		const reference_node = await get_c_node()
		await prisma.node.move({ node: node, position: 'right', reference: { node: reference_node } })

		const result = await get_a_node()
		expect(result).toMatchObject({ path: '000100010004', depth: node.depth, numchild: node.numchild })
		const result_child = await get_a_a_node()
		expect(result_child).toMatchObject({ path: '0001000100040001' })
	})

	it('right — same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_d_node()

		await prisma.node.move({ node: node, position: 'right', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010005', depth: node.depth, numchild: node.numchild })
	})

	it('right — same level, descendants', async () => {
		const node = await get_a_node()
		const reference_node = await get_b_node()
		await prisma.node.move({ node: node, position: 'right', reference: { node: reference_node } })

		const result = await get_a_node()
		expect(result).toMatchObject({ path: '000100010003', depth: node.depth, numchild: node.numchild })
		const result_child = await get_a_a_node()
		expect(result_child).toMatchObject({ path: '0001000100030001' })
	})


	afterEach(resetDb)
})


// Position: left
describe('Operation: move(), Position: left', async () => {
	it('left — same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_b_node()

		await prisma.node.move({ node: node, position: 'left', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010002', depth: node.depth, numchild: node.numchild })
		const result_rn = await get_a_b_node()
		expect(result_rn).toMatchObject({ path: '0001000100010003', depth: reference_node.depth, numchild: reference_node.numchild })
	})

	it('left — same level, descendants', async () => {
		const node = await get_b_node()
		const reference_node = await get_a_node()

		await prisma.node.move({ node: node, position: 'left', reference: { node: reference_node } })

		const result = await get_b_node()
		expect(result).toMatchObject({ path: '000100010001', depth: node.depth, numchild: node.numchild })
		const result_rn = await get_a_node()
		expect(result_rn).toMatchObject({ path: '000100010002', depth: reference_node.depth, numchild: reference_node.numchild })
		const result_child = await get_b_a_node()
		expect(result_child).toMatchObject({ path: '0001000100010001' })
	})

	afterEach(resetDb)
})

// Position: first-sibling
describe('Operation: move(), Position: first-sibling', async () => {
	it('first-sibling — same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_b_node()

		await prisma.node.move({ node: node, position: 'first-sibling', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010001', depth: node.depth, numchild: node.numchild })
		const result_rn = await get_a_b_node()
		expect(result_rn).toMatchObject({ path: '0001000100010003', depth: reference_node.depth, numchild: reference_node.numchild })
	})

	it('first-sibling — same level, descendants', async () => {
		const node = await get_b_node()
		const reference_node = await get_c_node()

		await prisma.node.move({ node: node, position: 'first-sibling', reference: { node: reference_node } })

		const result = await get_b_node()
		expect(result).toMatchObject({ path: '000100010001', depth: node.depth, numchild: node.numchild })
		const result_rn = await get_c_node()
		// TODO: To confirm if this shouldn't be 0003 instead.
		expect(result_rn).toMatchObject({ path: '000100010004', depth: reference_node.depth, numchild: reference_node.numchild })
		const result_child = await get_b_a_node()
		expect(result_child).toMatchObject({ path: '0001000100010001' })
	})

	afterEach(resetDb)
})

// Errors
describe('Operation: move(), Errors', async () => {
	it.todo('Cannot move `node` to its descendant')
	it.todo('Nothing to move')
	it.todo('Not found desired node')
	it.todo('Not found desired reference node')

	afterEach(resetDb)
})
