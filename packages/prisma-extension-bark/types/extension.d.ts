import { BarkMethods } from ".";
import type { Prisma } from '@prisma/client'
import { Types } from '@prisma/client/runtime/library'

type BasePrismaMethodKeys =  Exclude<Types.Public.Operation, `$${string}`>

/**
 * TODO: Create extension context
 * Bark extension context
 * The builtin functions are specific to the test environment (SQLite)
 * which is technically the smallest subset of available functions
 * the `getExtensionContext` method exposes other ones too + "fields"
 * @deprecated TOOD
 */
export type BarkExtensionContext<T> = BarkMethods & { name?: string | undefined; }

