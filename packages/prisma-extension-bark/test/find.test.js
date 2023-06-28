import { PrismaClient } from '@prisma/client'
import { bark } from '../src'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './setup/seed'

const prisma = new PrismaClient().$extends(bark)
const get_a_node = prisma.node.findUniqueOrThrow.bind(null, { where: { id: 3 } })

describe('findParent()', async () => {
	const rootNode = await prisma.node.findUnique({ where: { id: 1 } })
	const homeNode = await prisma.node.findUnique({ where: { id: 2 } })

	/* Home nodes */
	it('homeNode\'s parent using `where` arg', async () => {
		const parent = await prisma.node.findParent({where: { id: 2 }})
		expect(parent).toStrictEqual(rootNode)
	})
	it('homeNode\'s parent using `of` arg', async () => {
		const parent = await prisma.node.findParent({of: homeNode})
		expect(parent).toStrictEqual(rootNode)
	})

	/* Root node */
	it('rootNode\'s parent using `where` arg', async () => {
		const parent = await prisma.node.findParent({of: rootNode})
		expect(parent).toBe(null)
	})
	it('rootNode\'s parent using `of` arg', async () => {
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
