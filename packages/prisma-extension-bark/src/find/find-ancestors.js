import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'
import { has_nullish, merge_where_args } from 'src/utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/find').findAncestorsArgs<T, A>} args
 * @returns {Promise<import('$types/find').findAncestorsResult<T, A>>}
 */
export default async function ({ node, where, orderBy = default_order_by, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth

	 // Check if all requirements are available
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


	return ctx.findMany({
		where: merge_where_args({
			path: {
				in: ancestors_paths
			},
		}, where),
		orderBy,
		...args
	})




}
