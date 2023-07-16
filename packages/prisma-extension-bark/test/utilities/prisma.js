import { PrismaClient } from '@prisma/client'
import { bark } from '../../src/index.js'

export const prisma = new PrismaClient().$extends(bark({modelNames: ['node']}))

export const get_root_node = async () => prisma.node.findUniqueOrThrow({where: { id: 1 } })
export const get_home_node = async () => prisma.node.findUniqueOrThrow({ where: { id: 2 } })
export const get_a_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 3 } })
export const get_b_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 4 } })
export const get_c_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 5 } })
export const get_a_a_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 6 } })
export const get_a_b_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 7 } })
export const get_a_c_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 8 } })
export const get_a_d_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 9 } })
export const get_a_e_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 10 } })
export const get_b_a_node = async () => prisma.node.findUniqueOrThrow( { where: { id: 11 } })
