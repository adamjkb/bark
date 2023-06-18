import { PrismaClient } from '@prisma/client'
import { bark } from '../src'
import { describe, expect, it } from 'vitest'

const prisma = new PrismaClient().$extends(bark)

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