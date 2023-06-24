import { Prisma } from '@prisma/client'
import { increment_path, path_from_depth } from '../utils.js'

/**
 * @param {import('$types/create.js').createSiblingArgs} args
 */
export default async function ({ of, where, data }) {
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

	const last_sibling = await model.findSiblings({
		of: { path, depth },
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
		model.create({
			data: {
				...data,
				path: new_path,
				depth: last_sibling.depth,
				numchild: 0
			}
		}),
		// update parent numchild
		model.update({
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
