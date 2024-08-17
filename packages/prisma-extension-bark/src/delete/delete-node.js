import { Prisma } from '@prisma/client/extension'
import { has_nullish, path_from_depth } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/delete.d.ts').deleteNodeArgs<T, A>} args
 * @returns {Promise<import('$types/delete.d.ts').deleteNodeResult<T, A>>}
 */
export default async function ({ node }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth

	if (has_nullish(path, depth)) {
		const target = await ctx.findUniqueOrThrow({
			where: node,
			select: {
				path: true,
				depth: true
			}
		})
		path = target.path
		depth = target.depth
	}


	// update parent numchild if not a root node
	if (depth > 1) {
		const parent_path = path_from_depth({ path: path, depth: depth - 1 })
		await ctx.update({
			where: {
				path: parent_path
			},
			data: {
				numchild: {
					decrement: 1
				}
			}
		})
	}

	// Delete target and all their descendants
	return ctx.deleteMany({
		where: {
			path: {
				startsWith: path
			},
		}
	})
}
