import { Prisma } from '@prisma/client'
import { default_order_by, max_segment, min_segment } from '../consts.js'
import { path_from_depth } from '../utils.js'

/**
 * @param {import('../../types/find.js').findSiblingsArgs} args
 */
export default async function ({ of, where, orderBy = default_order_by, ...args }) {
	const model = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth

	// Get required arguments from instance
	if (of) {
		path = of.path
		depth = of.depth
	} else if (where) {
		const target = await model.findUnique({ where })
		if (target) {
			path = target.path
			depth = target.depth
		}
	}

	if (depth === 1) {
		// get the whole depth
		return model.findMany({
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

		return model.findMany({
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