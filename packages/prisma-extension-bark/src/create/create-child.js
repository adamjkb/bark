import { Prisma } from '@prisma/client/extension'
import { has_nullish, has_retain_columns, int2str } from '../utils.js'

/**
 * @template T - Model
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/create.d.ts').createChildArgs<T, A>} args
 * @returns {Promise<import('$types/create.d.ts').createChildResult<T, A>>}
 */
export default async function ({ node, data, retain, ...args }) {
	const ctx = Prisma.getExtensionContext(this)

	/** @type {string} */
	let path = node?.path
	/** @type {number} */
	let depth = node?.depth
	/** @type {number} */
	let numchild = node?.numchild

	// Get required arguments from instance
	if (has_nullish(path, depth, numchild)) {
		const target = await ctx.findUniqueOrThrow({
			where: node,
			select: {
				path: true,
				depth: true,
				numchild: true,
			},
		})
		if (target) {
			path = target.path
			depth = target.depth
			numchild = target.numchild
		}
	}

	// if already has kids
	if (numchild !== 0) {
		const child = await ctx
			.findChildren({
				node: { path, depth, numchild },
				select: {
					path: true,
					depth: true,
				},
				take: 1,
			})
			.then(([c]) => c)

		return ctx.createSibling({
			node: child,
			retain,
			data,
			...args,
		})
	} else {
		// node hasn't had any kid, so adding first one
		const new_step = int2str(1)
		const new_path = path + new_step

		let update_data = {
			numchild: {
				increment: 1,
			},
		}

		// Check for fields to retain
		if (has_retain_columns(retain)) {
			const old_data = await ctx.findUnique({
				where: {
					path: path,
				},
				select: retain,
			})

			if (old_data !== null)
				update_data = { ...update_data, ...old_data }
		}

		const [newborn] = await ctx.__$transaction([
			ctx.create({
				data: {
					...data,
					path: new_path,
					depth: depth + 1,
					numchild: 0,
				},
				...args,
			}),
			// update parent numchild
			ctx.update({
				where: {
					path: path,
				},
				data: update_data,
			}),
		])

		return newborn
	}
}
