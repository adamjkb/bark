import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'

/**
 * @param {import('$types/find.js').findAncestorsArgs} args
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


	// is root
	if (depth === 1) {
		return null
	}


	// chunk path into 4s
	const path_segments = path.match(/.{1,4}/g) || []


	const ancestors_paths = path_segments
		.slice(0, -1) // remove self
		.reduce((pV, cV) => {
			const nextValue = (pV.at(-1) || '') + cV

			return pV.concat(nextValue)
		}, [])


	return model.findMany({
		where: {
			path: {
				in: ancestors_paths
			}
		},
		orderBy,
		...args
	})




}
