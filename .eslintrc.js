module.exports = {
  extends: ["eslint:recommended"],

  env: {
    browser: true,
    node: true,
  },

  rules: {
    "no-cond-assign": ["off"],
    "no-useless-escape": ["off"],
    "no-empty": ["off"],
  },
};
