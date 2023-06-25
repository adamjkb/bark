import { Prisma } from '@prisma/client'
import { path_from_depth } from '../utils.js'

/**
 * @param {import('$types/delete.js').deleteNodeArgs} args
 */
export default async function ({ of, where }) {
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


	// update parent numchild
	if (depth <= 1) {
		const parent_path = path_from_depth({ path: path, depth: depth - 1 })
		await model.update({
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
	return model.deleteMany({
		where: {
			path: {
				startsWith: path
			},
		}
	})
}