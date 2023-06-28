import { Prisma } from '@prisma/client'

/**
 * @param {import('$types/find.js').findLastRootNodeArgs} args
 */
export default async function ({ ...args } = {}) {
	const model = Prisma.getExtensionContext(this)

	return model.findFirst({
		...args,
		where: {
			depth: 1
		},
		orderBy: {
			path: 'desc'
		}
	})
}
