import { Prisma } from '@prisma/client'
import { has_nullish, increment_path, path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/create.js').createSiblingArgs<T, A>} args
 * @returns {Promise<import('$types/create.js').createChildResult<T, A>>}
 */
export default async function ({ node, data, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.path

	// Get required arguments from instance
	if (has_nullish(path, depth)) {
		const target = await ctx.findUniqueOrThrow({
			where: node,
			select: { path: true, depth: true }
		})
		if (target) {
			path = target.path
			depth = target.depth
		}
	}

	const last_sibling = await ctx.findSiblings({
		node: { path, depth },
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

	const [newborn] = await ctx.__$transaction([
		ctx.create({
			data: {
				...data,
				path: new_path,
				depth: last_sibling.depth,
				numchild: 0
			},
			...args
		}),
		// update parent numchild
		ctx.update({
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
