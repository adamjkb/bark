import { BarkMethods } from ".";

/**
 * Bark extension context
 * The builtin functions are specific to the test environment (SQLite)
 * which is technically the smallest subset of available functions
 * the `getExtensionContext` method exposes other ones too + "fields"
 * @deprecated
 */
export type BarkExtensionContext<T> = BarkMethods & { name?: string | undefined; }

