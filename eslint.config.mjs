import globals from "globals";
import js from "@eslint/js";
import * as regexpPlugin from "eslint-plugin-regexp"

export default [
  {
    files: ["**/*.js", "**/*.mjs"],
  },
  js.configs.recommended,
  regexpPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      indent: [
        "warn",
        2,
        {
          SwitchCase: 1,
        },
      ],

      "space-infix-ops": [
        "warn",
        {
          int32Hint: false,
        },
      ],

      "no-cond-assign": ["off"],
      "no-useless-escape": ["off"],
      "no-empty": ["off"],
      "no-unused-vars": ["error", { "caughtErrors": "none" }],
    },
  },
];
