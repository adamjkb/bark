import globals from 'globals'
import js from '@eslint/js'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

/** @type {import('eslint').Linter.Config[]} */
export default [
	includeIgnoreFile(gitignorePath),
	// add more generic rule sets here, such as:
	js.configs.recommended,
	{
		ignores: ['**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node
			}
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
					'argsIgnorePattern': '^_',
					'destructuredArrayIgnorePattern': '^_'
				}
			]
		}
	}
]
