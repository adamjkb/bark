import { Prisma } from '@prisma/client'
import { path_from_depth } from '../utils.js'
import { STEP_LENGTH } from '../consts.js'

/**
 * @param {import('$types/delete.js').deleteManyNodesArgs} args
 */
export default async function ({ where }) {
	const ctx = Prisma.getExtensionContext(this)

	const targets = await ctx.findMany({
		where,
		select: {
			path: true,
			depth: true
		}
	})

	// couldn't find targets
	if (!targets?.length) {
		return null
	}

	// order for efficiency
	const ordered = targets
		.sort((a, b) => a.depth - b.depth)
		.sort((a, b) => a.path - b.path)

	const removable_nodes = new Map()
	const updatable_parent_nodes = new Map()

	// reduce minimum number of items we have to update / remove
	for (const itm of ordered) {
		let found = false
		for (let i = 0; i < itm.path.length / STEP_LENGTH; i++) {
			const patty = path_from_depth({ path: itm.path, depth: i + 1 })
			if (removable_nodes.has(patty)) {
				found = true
				break
			}
		}
		if (!found) {
			removable_nodes.set(itm.path, itm)

			// Calc parent path unless root
			if (itm.depth > 1) {
				const parent_path = path_from_depth({ path: itm.path, depth: itm.depth - 1 })
				// Increment how many of their children is being removed
				updatable_parent_nodes.set(parent_path, (updatable_parent_nodes.get(parent_path) ?? 0) + 1)
			}
		}
	}

	// update parent numchild
	for (const [parent_path, decrement_amount] of updatable_parent_nodes) {
		await ctx.update({
			where: {
				path: parent_path
			},
			data: {
				numchild: {
					decrement: decrement_amount
				}
			}
		})
	}

	// Delete paths
	const deleteCounts = await Promise.all(Array.from(removable_nodes.keys()).map(path => {
		return ctx.deleteMany({
			where: {
				path: {
					startsWith: path
				},
			}
		})
	}))

	return deleteCounts?.reduce?.((pV, cV) => ({count: pV.count + cV.count}), {count: 0})
}
