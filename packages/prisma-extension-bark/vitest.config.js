import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		threads: false,
		globalSetup: [
			'./test/setup/db-setup.js'
		]
	},
})
