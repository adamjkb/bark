import { Prisma } from '@prisma/client'

import * as find from './find/index.js'
import * as create from './create/index.js'
import * as deletes from './delete/index.js'
import * as operations from './operations/index.js'

/**
 * Initialize Bark as Prisma Extension
 *
 * @template {import('../types/extension.d.ts').BarkInitArgs} T
 *
 * @param {T} args
 * @returns {import('../types/extension.d.ts').BarkInitReturn<T>}
 */
export const bark = (args) => Prisma.defineExtension((client) => {
	return client.$extends({
		name: 'prisma-extension-bark',
		model: args.modelNames.reduce((pV, modelName) => ({
			...pV,
			[modelName]: {
				...find,
				...create,
				...deletes,
				...operations
			}
		}), {}),
	})
})
