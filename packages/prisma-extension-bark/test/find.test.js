import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed'
import { get_a_node, get_home_node, get_root_node, prisma } from './utilities/prisma.js'

describe('findParent()', async () => {
	const root_node = await get_root_node()
	const home_node = await get_home_node()

	/* Home nodes */
	it('home_node\'s parent using `where` arg', async () => {
		const parent = await prisma.node.findParent({where: { id: 2 }})
		expect(parent).toStrictEqual(root_node)
	})
	it('home_node\'s parent using `of` arg', async () => {
		const parent = await prisma.node.findParent({of: home_node})
		expect(parent).toStrictEqual(root_node)
	})

	/* Root node */
	it('root_node\'s parent using `where` arg', async () => {
		const parent = await prisma.node.findParent({of: root_node})
		expect(parent).toBe(null)
	})
	it('root_node\'s parent using `of` arg', async () => {
		const parent = await prisma.node.findParent({where: { id: 1 }})
		expect(parent).toBe(null)
	})

	/* None existent node */
	it('none existant node using `where` arg', async () => {
		const parent = await prisma.node.findParent({where: {id: 99999 }})
		expect(parent).toBe(undefined)
	})
})


describe('findTree()', async () => {
	it('no parent given, return whole model', async () => {
		const result = await prisma.node.findTree({ select: { id: true } })
		expect(result?.length).toBe(13)
	})

	it('parent given, and is not leaf', async () => {
		const parent = await get_a_node()
		const result = await prisma.node.findTree({
			parent: {
				of: parent
			},
			select: { path: true },
			orderBy: {
				path: 'desc'
			}
		})
		expect(result?.length).toBe(6)
		expect(result?.at?.(0)?.path).toBe('0001000100010005')
		expect(result?.at?.(-1)?.path).toBe('000100010001')
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
