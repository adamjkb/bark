import { Prisma } from '@prisma/client/extension'

import * as find from './find/index.js'
import * as create from './create/index.js'
import * as deletes from './delete/index.js'
import * as operations from './operations/index.js'

/**
 * Initialize Bark as Prisma Extension
*
* @type {import('$types/index.d.ts').withBark}
*/
export const withBark = (args) => Prisma.defineExtension(function (client) {
	const extensionMethods = {
		...find,
		...create,
		...deletes,
		...operations,
		/** Note: internal use only */
		__$transaction: async (...args)  => client.$transaction(...args)
	}

	return client.$extends({
		name: 'prisma-extension-bark',
		model: Object.fromEntries(args.modelNames.map(m => [m, extensionMethods])),
	})
})
