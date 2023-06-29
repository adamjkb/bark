
import { afterEach, describe, expect, it } from 'vitest'
import { seedOrResetDB } from './utilities/seed.js'
import { prisma } from './utilities/prisma.js'

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
