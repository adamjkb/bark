import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findDescendantsArgs<T,A>} args
 * @returns {Promise<import('$types/find').findDescendantsResult<T,A>>}
 */
export default async function ({ node, where, orderBy = default_order_by, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path
	/** @type {number} */
	let depth
	/** @type {number} */
	let numchild
	/** @type {number} */
	let id

	// Get required arguments from instance
	if (node) {
		path = node.path
		depth = node.depth
		numchild = node.numchild
		id = node.id
	} else if (where) {
		const target = await ctx.findUniqueOrThrow({ where })
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

	return ctx.findMany({
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
