import { rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'


/** @param {string} path */
function rimraf(path) {
	rmSync(path, { force: true, recursive: true })
}

let teardownHappened = false
const prisma = new PrismaClient()

/**
 * Setup database, seed, 
 */
export async function setup() {
	console.log('[Setup] Starting setup...')
    
	// Create prisma client
	execSync('npx prisma migrate dev --schema ./test/setup/schema.prisma --name init')
	console.log('[Setup] Created fresh Prisma migrations and client.')
}

export async function teardown() {
	if (teardownHappened)
		throw new Error('teardown called twice')
	teardownHappened = true
	console.log('[Teardown] Starting teardown...')

	await prisma.$disconnect()
	console.log('[Teardown] Disconnected Prisma client...')
    
	const migrationsFolder = new URL('./migrations', import.meta.url).pathname
	const dbFile = new URL('./test.db', import.meta.url).pathname
	rimraf(migrationsFolder)
	rimraf(dbFile)

	console.log('[Teardown] Deleted generated Prisma artifacts...')
}