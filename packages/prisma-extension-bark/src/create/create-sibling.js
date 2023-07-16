import { Prisma } from '@prisma/client'
import { increment_path, path_from_depth } from '../utils.js'

/**
 * @param {import('$types/create.js').createSiblingArgs} args
 */
export default async function ({ node, where, data, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth

	// Get required arguments from instance
	if (node) {
		path = node.path
		depth = node.depth
	} else if (where) {
		const target = await ctx.findUniqueOrThrow({ where })
		if (target) {
			path = target.path
			depth = target.depth
		}
	}

	const last_sibling = await ctx.findSiblings({
		node: { path, depth },
		select: {
			path: true,
			depth: true
		},
		orderBy: {
			path: 'desc'
		},
		take: 1
	}).then(([s]) => s)

	const parent_path = path_from_depth({ path, depth: depth - 1 })

	// create next path
	const new_path = increment_path(last_sibling.path)

	// FIXME: Suboptimal since transactions are not supported inside model extensions.
	const [newborn] = await Promise.all([
		ctx.create({
			data: {
				...data,
				path: new_path,
				depth: last_sibling.depth,
				numchild: 0
			},
			...args
		}),
		// update parent numchild
		ctx.update({
			where: {
				path: parent_path
			},
			data: {
				numchild: {
					increment: 1
				}
			}
		})
	])

	return newborn
}
