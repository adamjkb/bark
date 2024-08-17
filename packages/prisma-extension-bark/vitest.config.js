import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		pool: 'threads',
		poolOptions: {
			threads: {
				singleThread: true
			}
		},
		globalSetup: [
			'./test/setup/db-setup.js'
		]
	},
})
