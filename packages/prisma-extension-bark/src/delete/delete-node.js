import { Prisma } from '@prisma/client'
import { path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/delete').deleteNodeArgs<T, A>} args
 * @returns {Promise<import('$types/delete').deleteNodeResult<T, A>>}
 */
export default async function ({ node, where }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth

	if (node) {
		path = node.path
		depth = node.depth
	} else if (where) {
		const target = await ctx.findUniqueOrThrow({
			where,
			select: {
				path: true,
				depth: true
			}
		})
		if (target) {
			path = target.path
			depth = target.depth
		}
	}


	// update parent numchild if not a root node
	if (depth > 1) {
		const parent_path = path_from_depth({ path: path, depth: depth - 1 })
		await ctx.update({
			where: {
				path: parent_path
			},
			data: {
				numchild: {
					decrement: 1
				}
			}
		})
	}

	// Delete target and all their descendants
	return ctx.deleteMany({
		where: {
			path: {
				startsWith: path
			},
		}
	})
}
