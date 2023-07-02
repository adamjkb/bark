import { Prisma } from '@prisma/client'
import { int2str } from '../utils.js'

/**
 * @param {import('$types/create.js').createChildArgs} args
 */
export default async function ({ node, where, data, ...args }) {
	const model = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth
	/** @type {number} */
	let numchild

	// Get required arguments from instance
	if (node) {
		path = node.path
		depth = node.depth
		numchild = node.numchild
	} else if (where) {
		const target = await model.findUniqueOrThrow({ where })
		if (target) {
			path = target.path
			depth = target.depth
			numchild = target.numchild
		}
	}

	// if already has kids
	if (numchild !== 0) {
		const child = await model.findChildren({
			node: {path, depth, numchild},
			select: {
				path: true,
				depth: true
			},
			take: 1
		}).then(([c]) => c)

		return model.createSibling({
			node: child,
			data,
			...args
		})
	} else {
		// node hasn't had any kid, so adding first one
		const new_step = int2str(1)
		const new_path = path + new_step

		// FIXME: Suboptimal since transactions are not supported inside model extensions.
		const [newborn] = await Promise.all([
			model.create({
				data: {
					...data,
					path: new_path,
					depth: depth + 1,
					numchild: 0
				},
				...args
			}),
			// update parent numchild
			model.update({
				where: {
					path: path
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
}
