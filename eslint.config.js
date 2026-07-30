// Flat config, required from ESLint v9. Replaces .eslintrc.js.
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = tseslint.config(
	{
		ignores: ["dist/**", "node_modules/**", "test/**"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: globals.browser,
		},
		rules: {
			indent: ["error", "tab"],
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			// typescript-eslint v8 raised these to errors. Keep the severity
			// this project had under v5 so the upgrade doesn't turn existing
			// code into a build blocker.
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": ["warn", {
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrors: "none",
			}],
		},
	},
	{
		// Build and config files run in Node and are CommonJS by design.
		files: ["eslint.config.js", "webpack.config.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: globals.node,
		},
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},
);
