import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed'
import {
	get_a_a_node,
	get_a_b_node,
	get_a_c_node,
	get_a_d_node,
	get_a_e_node,
	get_a_node,
	get_b_a_node,
	get_b_node,
	get_c_node,
	get_home_node,
	prisma
} from './utilities/prisma'

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

	afterEach(seedOrResetDB)
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


	afterEach(seedOrResetDB)
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


	it('left — same level, descendants', async () => {
		const node = await get_c_node()
		const reference_node = await get_b_node()

		await prisma.node.move({ node: node, position: 'left', reference: { node: reference_node } })

		const result = await get_c_node()
		expect(result).toMatchObject({ path: '000100010002', depth: node.depth, numchild: node.numchild })
	})

	afterEach(seedOrResetDB)
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
		expect(result_rn).toMatchObject({ path: '000100010003', depth: reference_node.depth, numchild: reference_node.numchild })
		const result_child = await get_b_a_node()
		expect(result_child).toMatchObject({ path: '0001000100010001' })
	})

	afterEach(seedOrResetDB)
})

// Position: last-child
describe('Operation: move(), Position: last-child', async () => {
	it('last-child — no depth move, no descendants', async () => {
		const node = await get_b_a_node()
		const reference_node = await get_a_node()

		await prisma.node.move({ node: node, position: 'last-child', reference: { node: reference_node } })

		const result = await get_b_a_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth, numchild: node.numchild })
	})

	it('last-child — depth move, descendants', async () => {
		const node = await get_b_node()
		const reference_node = await get_a_node()
		const home_node = await get_home_node()

		await prisma.node.move({ node: node, position: 'last-child', reference: { node: reference_node } })

		const result_home_node = await get_home_node()
		expect(result_home_node).toMatchObject({ depth: home_node.depth, numchild: home_node.numchild - 1 })
		const result_reference_node = await get_a_node()
		expect(result_reference_node).toMatchObject({ depth: reference_node.depth, numchild: reference_node.numchild + 1 })
		const result = await get_b_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth + 1, numchild: node.numchild })
		const result_child = await get_b_a_node()
		expect(result_child).toMatchObject({ path: '00010001000100060001', depth: node.depth + 2 })

	})

	afterEach(seedOrResetDB)
})

// Position: first-child
describe('Operation: move(), Position: first-child', async () => {
	it('first-child — no depth move, no descendants', async () => {
		const node = await get_a_b_node()
		const reference_node = await get_b_node()

		await prisma.node.move({ node: node, position: 'first-child', reference: { node: reference_node } })

		const result = await get_a_b_node()
		expect(result).toMatchObject({ path: '0001000100020001', depth: node.depth, numchild: node.numchild })
	})

	it('first-child — depth move, descendants', async () => {
		const node = await get_a_node()
		const reference_node = await get_b_node()

		await prisma.node.move({ node: node, position: 'first-child', reference: { node: reference_node } })

		const result = await get_a_node()
		expect(result).toMatchObject({ path: '0001000100020001', depth: node.depth + 1, numchild: node.numchild })
		const result_child = await get_a_a_node()
		expect(result_child).toMatchObject({ path: '00010001000200010001', depth: node.depth + 2 })

	})

	afterEach(seedOrResetDB)
})

// Errors
describe('Operation: move(), Errors', async () => {
	it('errors — move to its descendant', async () => {
		const node = await get_a_node()
		const reference_node = await get_a_b_node()
		const fn = prisma.node.move({ node: node, position: 'left', reference: { node: reference_node } })
		await expect(fn).rejects.toThrowError(/descendant/)
	})
	it('errors — nothing to move', async () => {
		const node = await get_a_node()
		const reference_node = await get_a_node()
		const fn = prisma.node.move({ node: node, position: 'first-sibling', reference: { node: reference_node } })
		await expect(fn).rejects.toThrowError(/Nothing to move/)
	})

	it('errors — Not found desired node', async () => {
		const reference_node = await get_a_node()
		const fn = prisma.node.move({ where: { id: 9999 }, position: 'first-sibling', reference: { node: reference_node } })
		await expect(fn).rejects.toThrowError(/No(.*)found$/)
	})

	it('errors — Not found desired reference node', async () => {
		const node = await get_a_node()
		const fn = prisma.node.move({ node, position: 'first-sibling', reference: { where: { id: 9999 } } })
		await expect(fn).rejects.toThrowError(/No(.*)found$/)
	})

	afterEach(seedOrResetDB)
})
