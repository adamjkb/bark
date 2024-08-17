import { Prisma } from '@prisma/client'
import { has_nullish, merge_where_args, path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find.d.ts').findParentArgs<T, A>} args
 * @returns {Promise<import('$types/find.d.ts').findParentResult<T, A>>}
 */
export default async function ({ node, where, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth

	if (has_nullish(path, depth)) {
		const target = await ctx.findUnique({
			where: node,
			select: {
				path: true,
				depth: true
			}
		})

		if (target) {
			path = target.path
			depth = target.depth
		} else {
			return null
		}
	}
	if (depth && path) {
		// depth indicates no parent
		if (depth <= 1) {
			return null
		}

		const parent_path = path_from_depth({ path, depth: depth - 1 })
		return ctx.findUnique({
			where: merge_where_args({
				path: parent_path
			}, where),
			...args
		})
	}
}
