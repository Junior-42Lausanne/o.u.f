/** @type {import('prettier').Config} */
const prettierConfig = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [
		'prettier-plugin-embed',
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-sql'
	],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};

/** @type {import('prettier-plugin-embed').PrettierPluginEmbedOptions} */
const prettierPluginEmbedConfig = {
	embeddedSqlTags: ['sql']
};

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
	language: 'postgresql',
	database: 'postgresql',
	keywordCase: 'upper',
	dataTypeCase: 'upper',
	functionCase: 'upper',
	identifierCase: 'lower'
};

const config = {
	...prettierConfig,
	...prettierPluginEmbedConfig,
	...prettierPluginSqlConfig
};

export default config;
