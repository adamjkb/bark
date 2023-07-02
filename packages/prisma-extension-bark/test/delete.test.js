
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed.js'
import { get_a_e_node, get_a_node, get_b_node, get_c_node, get_home_node, get_root_node, prisma } from './utilities/prisma.js'

describe('deleteNode()', async () => {
	it('delete home node', async () => {
		const node = await get_home_node()

		const result = await prisma.node.deleteNode({ node })
		expect(result?.count).toBe(12)

		// check if only root left
		const remainingTree = await prisma.node.findMany()
		expect(remainingTree).toMatchObject([{path: '0001', numchild: 0}])
	})

	it('delete root node', async () => {
		const node = await get_root_node()

		const result = await prisma.node.deleteNode({ where: { path: node.path } })
		expect(result?.count).toBe(13)

		// check if only root left
		const remainingTree = await prisma.node.findMany()
		expect(remainingTree?.length).toBe(0)
	})
	afterEach(seedOrResetDB)
})



describe('deleteManyNodes()', async () => {
	it('in id list', async () => {
		const b_node = await get_b_node()
		const c_node = await get_c_node()
		const a_e_node = await get_a_e_node()
		const result = await prisma.node.deleteManyNodes({
			where: {
				id: {
					in: [b_node.id, c_node.id, a_e_node.id]
				}
			}
		})
		expect(result.count).toBe(6)

		const home_node_after = await get_home_node()
		expect(home_node_after?.numchild).toBe(1)
		const a_node_after = await get_a_node()
		expect(a_node_after?.numchild).toBe(4)
	})

	it('single item, just in case...', async () => {
		const b_node = await get_b_node()
		const result = await prisma.node.deleteManyNodes({
			where: {
				id: b_node.id
			}
		})
		expect(result.count).toBe(4)

		const home_node_after = await get_home_node()
		expect(home_node_after?.numchild).toBe(2)
	})

	it('none-existent node', async () => {
		const result = await prisma.node.deleteManyNodes({
			where: {
				id: 9999
			}
		})
		expect(result).toBe(null)
	})

	it('none-existent node with existent nodes', async () => {
		const result = await prisma.node.deleteManyNodes({
			where: {
				id: { in: [9999, 1] }
			}
		})
		expect(result.count).toBe(13)
	})
	afterEach(seedOrResetDB)
})
