import { PrismaClient } from '@prisma/client'
import { withBark } from 'prisma-extension-bark'

const prisma = new PrismaClient().$extends(withBark({ modelNames: ['node'] }))

const x = await prisma.node.findLastRoot({select: { path: true }})
const aNodeChildren = await prisma.node.findChildren({ where: { id: 3 } })

console.log(aNodeChildren)
