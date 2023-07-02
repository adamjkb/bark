import { Prisma } from '@prisma/client'
import { increment_path, int2str } from '../utils.js'

/**
 * @param {import('$types/create.js').createRootArgs} args
 */
export default async function ({ data, ...args }) {
	const model = Prisma.getExtensionContext(this)

	const last_root = await model.findLastRoot({ select: {
		path: true
	} })

	let new_path = null
	if (last_root) {
		new_path = increment_path(last_root.path)
	} else {
		new_path = int2str(1)
	}

	return model.create({
		data: {
			...data,
			path: new_path,
			depth: 1,
			numchild: 0,
		},
		...args
	})
}
