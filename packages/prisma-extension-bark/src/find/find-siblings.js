import { Prisma } from '@prisma/client'
import { default_order_by, max_segment, min_segment } from '../consts.js'
import { path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findSiblingsArgs<T, A>} args
 * @returns {Promise<import('$types/find').findSiblingsResult<T, A>>}
 */
export default async function ({ node, where, orderBy = default_order_by, ...args }) {
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

	if (depth === 1) {
		// get the whole depth
		return ctx.findMany({
			where: { depth },
			orderBy,
			...args
		})
	}

	if (depth > 1) {
		// making sure the non-root nodes share a parent
		const parent_path = path_from_depth({ path, depth: depth - 1 })
		const gt_path = parent_path + min_segment
		const lte_path = parent_path + max_segment

		return ctx.findMany({
			where: {
				depth,
				path: {
					gt: gt_path,
					lte: lte_path,
				}
			},
			orderBy,
			...args
		})
	}
}
