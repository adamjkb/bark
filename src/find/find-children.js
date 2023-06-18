import { Prisma } from '@prisma/client'
import { default_order_by, max_segment, min_segment } from '../consts.js'

/**
 * @param {import('../../types/find.js').findChildrenArgs} args
 */
export default async function ({ of, where, orderBy = default_order_by, ...args }) {
	const model = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth
	/** @type {number} */
	let numchild

	// Get required arguments from instance
	if (of) {
		path = of.path
		depth = of.depth
		numchild = of.numchild
	} else if (where) {
		const target = await model.findUnique({ where })
		if (target) {
			path = target.path
			depth = target.depth
			numchild = target.numchild
		}
	}


	// forever alone / is leaf
	if (numchild === 0) {
		return null
	}

	const gt_path = path + min_segment
	const lte_path = path + max_segment


	return model.findMany({
		where: {
			depth: depth + 1,
			path: {
				gt: gt_path,
				lte: lte_path,
			}
		},
		orderBy,
		...args
	})
}