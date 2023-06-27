import { Prisma } from '@prisma/client'
import { default_order_by } from '../consts.js'

/**
 * @param {import('$types/find.js').findTreeArgs} args
 */
export default async function ({ orderBy = default_order_by, parent: parentArg, ...args }) {
	const model = Prisma.getExtensionContext(this)

	let parent = parentArg?.of

	if (parentArg?.of) {
		parent = parentArg.of
	} else if (parentArg?.where) {
		const target = await model.findUniqueOrThrow({
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
		return model.findMany({
			orderBy,
			...args
		})
	}

	// forever alone / is leaf
	if (parent.numchild === 0) {
		return model.findMany({
			where: { id: parent.id },
			orderBy,
			...args
		})
	}

	return model.findMany({
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
