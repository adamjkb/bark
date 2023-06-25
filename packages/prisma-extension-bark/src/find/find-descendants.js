import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'

/**
 * @param {import('$types/find.js').findDescendantsArgs} args
 */
export default async function ({ of, where, orderBy = default_order_by, ...args }) {
	const model = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth
	/** @type {number} */
	let numchild
	/** @type {number} */
	let id

	// Get required arguments from instance
	if (of) {
		path = of.path
		depth = of.depth
		numchild = of.numchild
		id = of.id
	} else if (where) {
		const target = await model.findUnique({ where })
		if (target) {
			path = target.path
			depth = target.depth
			numchild = target.numchild
			id = target.id
		}
	}


	// forever alone / is leaf
	if (numchild === 0) {
		return null
	}

	if (depth <= 1) {
		// return the entire tree
		return model.findMany()
	}


	return model.findMany({
		where: {
			id: {
				not: id
			},
			path: {
				startsWith: path,
			},
			depth: {
				gte: depth
			}
		},
		orderBy,
		...args
	})




}
