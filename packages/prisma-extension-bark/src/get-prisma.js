const prismaCache = new Map()

export async function getPrisma(context) {
	const path = context?._prismaClientPath || '@prisma/client/extension'
	
	if (!prismaCache.has(path)) {
		const module = await import(path)
		prismaCache.set(path, module.Prisma)
	}
	
	return prismaCache.get(path)
}