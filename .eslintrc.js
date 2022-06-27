module.exports = {
  extends: ["eslint:recommended"],

  env: {
    browser: true,
    node: true,
  },

  rules: {
    'indent': ['warn', 2, { "SwitchCase": 1 }],
    "space-infix-ops": ["warn", { "int32Hint": false }],

    "no-cond-assign": ["off"],
    "no-useless-escape": ["off"],
    "no-empty": ["off"],
  },
};
