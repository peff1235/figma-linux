const js = require("@eslint/js");
const eslintPluginTypescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "build/**"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: typescriptParser,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      ...prettier.rules,
      "jsx-quotes": [1, "prefer-double"],
      "max-len": [
        "warn",
        {
          code: 120,
        },
      ],
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/no-use-before-define": ["warn"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-require-imports": ["off"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "no-empty": ["off"],
      "no-undef": ["off"],
    },
  },
];
