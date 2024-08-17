import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed'
import { get_a_a_node, get_a_node, get_c_node, get_home_node, get_root_node, prisma } from './utilities/prisma.js'

describe('findParent()', async () => {
	const root_node = await get_root_node()
	const home_node = await get_home_node()

	/* Home nodes */
	it('home_node\'s parent using node input', async () => {
		const parent = await prisma.node.findParent({ node: { id: 2 }})
		expect(parent).toStrictEqual(root_node)
	})
	it('home_node\'s parent using node query', async () => {
		const parent = await prisma.node.findParent({ node: home_node })
		expect(parent).toStrictEqual(root_node)
	})

	/* Root node */
	it('root_node\'s parent using node input', async () => {
		const parent = await prisma.node.findParent({ node: { id: 1 } })
		expect(parent).toBe(null)
	})
	it('root_node\'s parent using node query', async () => {
		const parent = await prisma.node.findParent({ node: { id: 1 } })
		expect(parent).toBe(null)
	})

	/* None existent node */
	it('none existent node', async () => {
		const parent = await prisma.node.findParent({node: { id: 99999 }})
		expect(parent).toBe(null)
	})
})

describe('findLastRoot()', async () => {
	it('root node w/o args', async () => {
		const result = await prisma.node.findLastRoot()
		expect(result).toMatchObject({path: '0002', depth: 1, numchild: 0, name: 'Root 2'})
	})

	it('root node w/ args', async () => {
		const result = await prisma.node.findLastRoot({ select: { path: true } })
		expect(result).toStrictEqual({ path: '0002' })
	})

	it('root node w/ where arg', async () => {
		const result = await prisma.node.findLastRoot({ where: { numchild: 0 } })
		expect(result?.path).toBe('0002')
	})

	beforeAll(async () => {
		// Setup more root nodes
		await prisma.node.create({
			data: {
				path: '0002',
				depth: 1,
				numchild: 0,
				name: 'Root 2'
			}
		})
	})

	afterAll(seedOrResetDB)
})


describe('findChildren()', async () => {
	it('has children, node input, w/ args', async () => {
		const node = await get_a_node()

		const result = await prisma.node.findChildren({ node, select: { path: true }, orderBy: { path: 'desc' } })
		expect(result?.length).toBe(5)
		expect(result?.at?.(0)?.path).toBe('0001000100010005')
		expect(result?.at?.(-1)?.path).toBe('0001000100010001')
	})

	it('has children, node query, w/o args', async () => {
		const node = await get_a_node()

		const result = await prisma.node.findChildren({ node: { id: node.id } })
		expect(result?.length).toBe(5)
		expect(result?.at?.(0)?.path).toBe('0001000100010001')
		expect(result?.at?.(-1)?.path).toBe('0001000100010005')
	})

	it('has children, node input, where arg', async () => {
		const node = await get_a_node()

		const result = await prisma.node.findChildren({
			node,
			where: {
				OR: [
					{
						path: { endsWith: '3' }
					},
					{
						name: { equals: 'A-D' }
					},
				]
			}
		})
		expect(result?.length).toBe(2)
		expect(result?.at?.(0)?.path).toBe('0001000100010003')
		expect(result?.at?.(-1)?.path).toBe('0001000100010004')
	})

	it('no children, node input, w/o args', async () => {
		const node = await get_a_a_node()

		const result = await prisma.node.findChildren({ node })
		expect(result).toBe(null)
	})
})

describe('findSiblings()', async () => {
	it('node input, w/ args', async () => {
		const node = await get_a_node()

		const result = await prisma.node.findSiblings({ node, select: { path: true }, orderBy: { path: 'desc' } })
		expect(result?.length).toBe(3)
		expect(result?.at?.(0)?.path).toBe('000100010003')
		expect(result?.at?.(-1)?.path).toBe('000100010001')
	})

	it('node query, w/o args', async () => {
		// const node = await get_a_node()
		const result = await prisma.node.findSiblings({ node: { id: 3 }})
		expect(result?.length).toBe(3)
		expect(result?.at?.(0)?.path).toBe('000100010001')
		expect(result?.at?.(-1)?.path).toBe('000100010003')
	})

	it('node input, where arg', async () => {
		const node = await get_a_node()

		const result = await prisma.node.findSiblings({
			node,
			where :{
				numchild: { not: 0 }
			}
		})
		expect(result?.length).toBe(2)
		expect(result?.at?.(0)?.path).toBe('000100010001')
		expect(result?.at?.(-1)?.path).toBe('000100010002')
	})
})

describe('findAncestors()', async () => {
	it('node input, w/ args', async () => {
		const node = await get_a_a_node()

		const result = await prisma.node.findAncestors({ node, select: { path: true }, orderBy: { path: 'desc' } })
		expect(result).toStrictEqual([{ path: '000100010001' }, { path: '00010001' }, { path: '0001' }])
	})

	it('node query, w/o args', async () => {
		const node = await get_a_a_node()

		const result = await prisma.node.findAncestors({ node: { id: node.id }})
		expect(result?.length).toBe(3)
		expect(result?.at?.(0)?.path).toBe('0001')
		expect(result?.at?.(-1)?.path).toBe('000100010001')
	})

	it('node input, where arg', async () => {
		const node = await get_a_a_node()

		const result = await prisma.node.findAncestors({ node, where: {
			depth: {
				gte: 2
			}
		}})

		expect(result?.length).toBe(2)
		expect(result?.at?.(0)?.path).toBe('00010001')
		expect(result?.at?.(-1)?.path).toBe('000100010001')
	})

	it('root node, w/o args', async () => {
		const node = await get_root_node()

		const result = await prisma.node.findAncestors({ node })
		expect(result).toBe(null)
	})
})

describe('findDescendants()', async () => {
	it('node input, w/ args', async () => {
		const node = await get_home_node()

		const result = await prisma.node.findDescendants({ node, select: { path: true }, orderBy: { path: 'desc' } })
		expect(result?.length).toBe(11)
		expect(result?.at?.(0)?.path).toBe('000100010003')
		expect(result?.at?.(-1)?.path).toBe('000100010001')
	})

	it('node query, w/o args', async () => {
		const node = await get_home_node()

		const result = await prisma.node.findDescendants({ node: { id: node.id }})
		expect(result?.length).toBe(11)
		expect(result?.at?.(0)?.path).toBe('000100010001')
		expect(result?.at?.(-1)?.path).toBe('000100010003')
	})

	it('node input, where arg', async () => {
		const node = await get_home_node()

		const result = await prisma.node.findDescendants({ node, where: {
			OR: [
				{
					name: 'B'
				},
				{
					name: 'C'
				}
			]
		} })
		expect(result?.length).toBe(2)
		expect(result?.at?.(0)?.path).toBe('000100010002')
		expect(result?.at?.(-1)?.path).toBe('000100010003')
	})

	it('node input, no descendants, w/o args', async () => {
		const node = await get_c_node()

		const result = await prisma.node.findDescendants({ node })
		expect(result).toBe(null)
	})
})

