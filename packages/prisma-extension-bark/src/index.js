import { Prisma } from '@prisma/client'

import * as find from './find/index.js'
import * as create from './create/index.js'
import * as deletes from './delete/index.js'
import * as operations from './operations/index.js'

export const bark = Prisma.defineExtension((client) => {
	return client.$extends({
		name: 'prisma-extension-bark',
		model: {
			node: {
				...find,
				...create,
				...deletes,
				...operations
			}
		},
	})
})
