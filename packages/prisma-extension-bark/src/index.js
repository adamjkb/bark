import * as find from './find/index.js'
import * as create from './create/index.js'
import * as deletes from './delete/index.js'
import * as operations from './operations/index.js'

/**
 * Initialize Bark as Prisma Extension
*
* @type {import('$types/index.d.ts').withBark}
*/
export const withBark = (args) => {
	const prismaPath = args.prismaClientPath || '@prisma/client/extension'
	
	// Inject prismaClientPath into all methods
	const injectPath = (methods) => {
		return Object.fromEntries(
			Object.entries(methods).map(([key, fn]) => [
				key,
				function(...fnArgs) {
					// Add prismaClientPath to context
					this._prismaClientPath = prismaPath
					return fn.apply(this, fnArgs)
				}
			])
		)
	}
	
	return async function(client) {
		const { Prisma } = await import(prismaPath)
		
		return Prisma.defineExtension(function (client) {
			const extensionMethods = {
				...injectPath(find),
				...injectPath(create),
				...injectPath(deletes),
				...injectPath(operations),
				/** Note: internal use only */
				__$transaction: async (...args)  => client.$transaction(...args),
				_prismaClientPath: prismaPath
			}

			return client.$extends({
				name: 'prisma-extension-bark',
				model: Object.fromEntries(args.modelNames.map(m => [m, extensionMethods])),
			})
		})
	}
}
