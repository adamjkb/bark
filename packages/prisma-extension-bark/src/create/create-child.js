import { Prisma } from '@prisma/client'
import { int2str } from '../utils.js'

/**
 * @param {import('$types/create.js').createChildArgs} args
 */
export default async function ({ of, where, data }) {
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

	// if already has kids
	if (numchild !== 0) {
		const child = await model.findChildren({
			of: {path, depth, numchild},
			select: {
				path: true,
				depth: true
			},
			take: 1
		}).then(([c]) => c)

		return model.createSibling({
			of: child,
			data
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
				}
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
