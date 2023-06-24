module.exports = {
	root: true,
	extends: ['eslint:recommended'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022
	},
	rules: {
		// Generic Rules
		indent: ['error', 'tab'],
		quotes: ['error', 'single'],
		semi: ['warn', 'never'],
		'no-case-declarations': 0,
		'no-undef': 'error',
		'no-unused-vars': [
			'warn',
			{
				'vars': 'all',
				'args': 'after-used',
				'ignoreRestSiblings': true,
				'argsIgnorePattern': '^_'
			}
		]
	},
	env: {
		browser: false,
		es2017: true,
		node: true
	}
}
