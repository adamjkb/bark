import { Prisma } from '@prisma/client'
import { increment_path, int2str, last_position_in_path, path_from_depth } from '../utils'

/**
 * @param {import('$types/operations').moveArgs} args
 */
export default async function ({ node, where, position, reference }) {
	const model = Prisma.getExtensionContext(this)
	// <sorry>
	/**
	 *r
	 * @param {Object} opts
	 * @param {string} opts.old_path
	 * @param {string} opts.new_path
	 * @param {number} opts.new_depth
	 */
	async function update_thingies({ old_path, new_path, new_depth }) {
		/** @type {Promise<import('@prisma/client').Prisma.PrismaPromise<any>> | any[]}*/
		const queue = []

		// TODO: Ideally this would make use of transactions
		// Issue is that Promise.all-ing a queue will lock SQLite but $transactions won't
		// As a work-around we can set connection_limit=1
		// https://github.com/prisma/prisma/issues?q=is%3Aissue+is%3Aopen+label%3A%22topic%3A+Timed+out+during+query+execution%22
		queue.push(model.update({
			where: { path: old_path },
			data: {
				path: new_path,
				depth: new_depth
			}
		}))

		const moveable_node = await model.findFirstOrThrow({
			where: { path: old_path },
			select: {
				path: true,
				depth: true,
				numchild: true,
				id: true,
			}
		})

		if (moveable_node.numchild !== 0) {
			const descendants = await model.findDescendants({ of: moveable_node, select: { id: true, path: true, depth: true }})


			for (const descendant of descendants) {
				const new_descendant_path = descendant.path.replace(old_path, new_path)

				const new_descendant_depth = moveable_node.depth !== new_depth ? descendant.depth + new_depth - moveable_node.depth : null

				queue.push(model.update({
					where: {
						id: descendant.id
					},
					data: {
						path: new_descendant_path,
						...(new_descendant_depth ? {depth: new_descendant_depth} : {})
					}
				}))
			}
		}

		await Promise.all(queue)
	}
	// </sorry>

	let original_node = node
	// TODO: Add query logic
	let rn_node = reference.node

	if (node) {
		original_node = node
	} else if (where) {
		const target = await model.findUnique({ where })
		if (target) {
			original_node = target
		}
	}
	if (original_node && rn_node) {
		const shared_rn_query_args = {
			of: rn_node,
			select: {
				id: true,
				path: true,
				numchild: true,
				depth: true
			},
			take: 1
		}

		/**
		 * Query nodes we might use through out this journey
		 */
		const rn_last_sibling = await model.findSiblings({
			...shared_rn_query_args,
			orderBy: {
				path: 'desc'
			}
		}).then(s => s?.[0])
		const rn_first_sibling = await model.findSiblings({
			...shared_rn_query_args,
			orderBy: {
				path: 'asc'
			}
		}).then(s => s?.[0])
		const rn_last_child = await model.findChildren({
			...shared_rn_query_args,
			orderBy: {
				path: 'desc'
			}
		}).then(s => s?.[0])


		/**
		 * Variables
		 */

		let new_depth = original_node.depth
		let new_pos = null
		let siblings = []


		/**
		 * Update variables if moving to a child so it becomes a move to sibling instead
		 */
		if (['first-child', 'last-child'].includes(position)) {
			// const parent = target
			new_depth++

			// forever alone / is leaf
			if (rn_node.numchild === 0) {
				new_pos = 1
				// Change position
				position = 'first-sibling'
				siblings = null
			} else {
				rn_node = rn_last_child
				switch (position) {
				case 'first-child':
					position = 'first-sibling'
					break
				case 'last-child':
					position = 'last-sibling'
					break
				}
			}
		}

		// test if target is not descendant of
		if (original_node.path.startsWith(rn_node.path) && original_node.depth > rn_node.depth) {
			throw 'Can\'t move `node` to its descendant'
		}

		// test if we actually need to move anything
		if (original_node.path === rn_node.path) {
			if (
				position === 'left' ||
				(
					(position === 'right' || position === 'last-sibling') &&
					rn_node.path === rn_last_sibling.path
				) ||
				(
					position === 'first-sibling' &&
					rn_node.path === rn_first_sibling.path
				)
			) {
				// TODO: Change to return
				throw 'Nothing to move'
			}
		}


		/**
		 * Start ordering
		 */
		if (
			position === 'last-sibling' ||
			(position === 'right' && rn_node.id === rn_last_sibling.id)) {
			// Easy mode!
			const new_path = increment_path(rn_last_sibling.path)
			console.log('1 ---- easy mode')
			await update_thingies({
				old_path: original_node.path,
				new_path,
				new_depth
			})
		} else {
			/**
			 * Let the FUN begin
			 */

			if (!new_pos) {
				siblings = await model.findSiblings({
					of: rn_node,
					select: {
						path: true,
						numchild: true,
						id: true,
						name: true
					}
				})

				const base_path_int = last_position_in_path({ path: rn_node.path })

				switch (position) {
				case 'left':
					new_pos = base_path_int
					siblings = siblings.filter(s => s.path >= rn_node.path)
					break
				case 'right':
					new_pos = base_path_int + 1
					siblings = siblings.filter(s =>  s.path > rn_node.path)
					break
				case 'first-sibling':
					// siblings are already correct
					new_pos = 1
					break
				}
			}

			const new_path = path_from_depth({ path: rn_node.path, depth: rn_node.depth - 1 }) + int2str(new_pos)


			// If the move is amongst siblings and is to the left and there
			// are siblings to the right of its new position then to be on
			// the safe side we temporarily dump it on the end of the list
			let temp_new_path = null

			if (original_node.path.length === new_path.length) {

				const parent_old_path = path_from_depth({ path: original_node.path, depth: original_node.depth - 1 })
				const parent_new_path = path_from_depth({ path: new_path, depth: new_depth })

				if (parent_old_path === parent_new_path && siblings?.length > 0 && new_path < original_node.path) {
					const base_path_int = last_position_in_path({ path: rn_last_sibling.path })
					temp_new_path = path_from_depth({ path: rn_node.path, depth: rn_node.depth - 1 }) + int2str(base_path_int + 2)

					console.debug('2 ---- hit temp new path')
					await update_thingies({
						old_path: original_node.path,
						new_path: temp_new_path, new_depth
					})
				}
			}

			// Optimisation to only move siblings which need moving
			//(i.e.if we've got holes, allow them to compress)
			let move_siblings = []
			let prior_path = new_path
			for (const node of siblings) {
				// If the path of the node is already greater than the path
				// of the previous node it doesn't need shifting
				if (node.path > prior_path) {
					continue
				}
				// It does need shifting, so add to the list
				move_siblings.push(node)
				// Calculate the path that it would be moved to, as that's
				// the next "priorpath"
				prior_path = increment_path(node.path)
			}
			// NOTE: Why?
			move_siblings.reverse()


			for (const node of move_siblings) {
				// moving the siblings(and their branches) at the right of the
				// related position one step to the right
				const node_new_path = increment_path(node.path)
				console.log('3 ---- moving siblings')
				await update_thingies({
					old_path: node.path,
					new_depth: node.depth,
					new_path: node_new_path
				})

				// if movebranch w/e
				if (original_node.path.startsWith(node.path)) {
					// if moving to a parent, update oldpath since we just
					// increased the path of the entire branch
					original_node.path = node_new_path + original_node.path.slice(node_new_path.length)
				}
			}

			// if movebranch w/e
			// node to move
			if (temp_new_path) {
				console.log('5 ---- move back from temp_new_path')
				// temp_new_path -> new_path
				// await push_new_path_updates({ ...of, path: temp_new_path }, new_path)
				await update_thingies({
					old_path: temp_new_path,
					new_depth,
					new_path,
				})
			} else {
				console.log('6 ---- move og to new_depth if no temp_new_path')
				await update_thingies({
					old_path: original_node.path,
					new_depth,
					new_path,
				})
			}


			// Updating parent numchilds when original_node is changing depth
			const original_parent_path = path_from_depth({ path: original_node.path, depth: original_node.depth - 1 })
			const new_parent_path = path_from_depth({ path: original_node.path, depth: new_depth - 1 })
			if (
				(!original_parent_path && new_parent_path) ||
				(original_parent_path && !new_parent_path) ||
				(original_parent_path !== new_parent_path)
			) {
				console.log('7 ---- Updating parent numchild')
				if (original_parent_path) {
					await model.update({
						where: { path: original_parent_path },
						data: { numchild: { decrement: 1 } }
					})
				}

				if (new_parent_path) {
					await model.update({
						where: { path: new_parent_path },
						data: { numchild: { increment: 1 } }
					})
				}
			}
		}
	} else {
		throw 'Not found desired `node`'
	}
}
