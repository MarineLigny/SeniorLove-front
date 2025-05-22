import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      react: pluginReact,
    },
    rules: {
      // Exemples de règles personnalisées
      "react/react-in-jsx-scope": "off", // inutile depuis React 17+
      "react/prop-types": "off",         // si vous utilisez TypeScript
    },
  },
  ...tseslint.configs.recommended,
  ...pluginReact.configs.flat.recommended,
]);
