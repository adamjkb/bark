import { Prisma } from '@prisma/client'
import { path_from_depth } from '../utils.js'

/**
 * @param {import('$types/find.js').findParentArgs} args
 */
export default async function ({ of, where, select }) {
	const model = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth

	if (of) {
		path = of.path
		depth = of.depth
	} else if (where) {
		const target = await model.findUnique({
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
	if (depth && path) {
		// depth indicates no parent
		if (depth <= 1) {
			return null
		}

		const parent_path = path_from_depth({ path, depth: depth - 1 })
		return model.findFirst({
			where: {
				path: parent_path
			},
			select,
		})
	}
}
