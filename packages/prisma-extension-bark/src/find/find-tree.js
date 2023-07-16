import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findTreeArgs<T, A>} args
 * @returns {Promise<import('$types/find').findTreeResult<T, A>>}
 */
export default async function ({ orderBy = default_order_by, parent: parentArg, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	let parent = parentArg?.node

	if (parentArg?.node) {
		parent = parentArg.node
	} else if (parentArg?.where) {
		const target = await ctx.findUniqueOrThrow({
			where: parentArg.where,
			select: { path: true, numchild: true, depth: true, id: true }
		}).catch(err => {
			err.message = 'Argument `parent.where`: ' + err.message
			throw err
		})

		if (target) {
			parent = target
		}
	}


	if (!parent) {
		// return the entire model
		return ctx.findMany({
			orderBy,
			...args
		})
	}

	// forever alone / is leaf
	if (parent.numchild === 0) {
		return ctx.findMany({
			where: { id: parent.id },
			orderBy,
			...args
		})
	}

	return ctx.findMany({
		where: {
			path: {
				startsWith: parent.path
			},
			depth: {
				gte: parent.depth
			}
		},
		orderBy,
		...args
	})
}
