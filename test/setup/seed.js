import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
try {
	const seed_data = [
		{'id': 1,	'name': 'Root', 	'path':'0001',				'depth': 1,		'numchild': 1 },
		{'id': 2,	'name': 'Home A', 	'path':'00010001',			'depth': 2,		'numchild': 3 },
		{'id': 3,	'name': 'A', 		'path':'000100010001',		'depth': 3,		'numchild': 5 },
		{'id': 4,	'name': 'B', 		'path':'000100010002',		'depth': 3,		'numchild': 3 },
		{'id': 5,	'name': 'C', 		'path':'000100010003',		'depth': 3,		'numchild': 0 },
		{'id': 6,	'name': 'A-A', 		'path':'0001000100010001',	'depth': 4,		'numchild': 0 },
		{'id': 7,	'name': 'A-B', 		'path':'0001000100010002',	'depth': 4,		'numchild': 0 },
		{'id': 8,	'name': 'A-C', 		'path':'0001000100010003',	'depth': 4,		'numchild': 0 },
		{'id': 9,	'name': 'A-D', 		'path':'0001000100010004',	'depth': 4,		'numchild': 0 },
		{'id': 10,	'name': 'B-A', 		'path':'0001000100020001',	'depth': 4,		'numchild': 0 },
		{'id': 11,	'name': 'B-B', 		'path':'0001000100020002',	'depth': 4,		'numchild': 0 },
		{'id': 12,	'name': 'B-C', 		'path':'0001000100020003',	'depth': 4,		'numchild': 0 },
	]

	for (const v of seed_data) {
		await prisma.node.create({
			data: {
				id: v.id,
				path: v.path,
				depth: v.depth,
				numchild: v.numchild,
				name: v.name
			}
		})
	}
	await prisma.$disconnect()
} catch (err) {
	console.error(err)
	await prisma.$disconnect()
	process.exit(1)
}
