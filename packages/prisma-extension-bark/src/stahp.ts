import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient().$extends({
	model: {
		$allModels: {
			async exists<T>(
				this: T,
				where: Prisma.Args<T, 'findFirst'>['where'],
				select?: Prisma.Args<T, 'findFirst'>['select']
			): Promise<boolean> {
				const context = Prisma.getExtensionContext(this)
				const result = await (context as any).findFirst({ where })
				return result !== null
			},
		},
	},
})


const user = await prisma.node.exists({
	name: 'Something'
}, {

})


console.log({ user })
