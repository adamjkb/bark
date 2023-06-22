import { PrismaClient } from '@prisma/client'
import { bark } from '../src'
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './setup/seed'

const prisma = new PrismaClient().$extends(bark)
const get_a_a_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 6 } })
const get_a_c_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 8 } })
const get_a_e_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 10 } })

const resetDb = async () => await seedOrResetDB()

// Position: last-sibling
describe('Operation: move(), Position: last-sibling', async () => {
	it('last-sibling, same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_a_node()

		await prisma.node.move({ node: node, position: 'last-sibling', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth, numchild: node.numchild })
	})

	afterEach(resetDb)
})

// Position: right
describe('Operation: move(), Position: right', async () => {
	it('right — (reference node is last-sibling), same level, no descendants', async () => {
		const node = await get_a_c_node()
		const reference_node = await get_a_e_node()

		await prisma.node.move({ node: node, position: 'right', reference: { node: reference_node } })

		const result = await get_a_c_node()
		expect(result).toMatchObject({ path: '0001000100010006', depth: node.depth, numchild: node.numchild })
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
