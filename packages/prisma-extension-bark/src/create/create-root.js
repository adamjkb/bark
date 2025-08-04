import { getPrisma } from '../get-prisma.js'
import { increment_path, int2str } from '../utils.js'

/**
 * @template T - ctx
 * @template A - Args
 *
 * @this {T}
 * @param {import('$types/create.d.ts').createRootArgs<T, A>} args
 * @returns {Promise<import('$types/create.d.ts').createRootResult<T, A>>}
 */
export default async function ({ data, ...args }) {
	const Prisma = await getPrisma(this)
	const ctx = Prisma.getExtensionContext(this)

	const last_root = await ctx.findLastRoot({ select: {
		path: true
	}})

	let new_path = null
	if (last_root) {
		new_path = increment_path(last_root.path)
	} else {
		new_path = int2str(1)
	}

	return ctx.create({
		data: {
			...data,
			path: new_path,
			depth: 1,
			numchild: 0,
		},
		...args
	})
}
