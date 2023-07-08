import { PrismaClient } from '@prisma/client'
import { bark } from 'prisma-extension-bark'

const prisma = new PrismaClient().$extends(bark({ modelNames: ['node'] }))

const aNodeChildren = await prisma.node.findChildren({ where: { id: 3 } })

console.log(aNodeChildren)
