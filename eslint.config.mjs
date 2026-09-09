import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "worldql/**",
    "scripts/output/**",
  ]),
  {
    plugins: nextVitals[0].plugins,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-html-link-for-pages": "off",
      "prefer-const": "warn",
      "no-var": "warn",
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "react/no-unescaped-entities": "off",
      "react/jsx-no-duplicate-props": "warn",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
