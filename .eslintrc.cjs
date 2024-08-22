module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    "no-var": "error",
    // Disallow the use of `var`.
    // "prettier/prettier": "error",
    // Disallow console usage.
    "no-console": "off",
    // Warn against the use of debugger.
    "no-debugger": "warn",
    // Warn against duplicate case labels.
    "no-duplicate-case": "warn",
    // Warn against empty statements.
    "no-empty": "warn",
    // Disallow unnecessary parentheses.
    "no-extra-parens": "off",
    // Disallow reassigning function declarations.
    "no-func-assign": "warn",
    // Warn against unreachable code after return, throw, continue, and break statements.
    "no-unreachable": "warn",
    // Enforce consistent brace style for all control statements.
    "curly": "off",
    // Require a default branch in switch statements.
    "default-case": "warn",
    // Enforce dot notation whenever possible.
    "dot-notation": "warn",
    // Require the use of === and !==.
    "eqeqeq": "warn",
    // Warn against if statements after return statements in the same block.
    "no-else-return": "warn",
    // Warn against empty functions.
    "no-empty-function": "warn",
    // Disallow unnecessary nested blocks.
    "no-lone-blocks": "warn",
    // Disallow multiple spaces.
    "no-multi-spaces": "warn",
    // Disallow redeclaration of variables.
    "no-redeclare": "warn",
    // Disallow assignment in return statements.
    "no-return-assign": "warn",
    // Disallow unnecessary return await.
    "no-return-await": "warn",
    // Disallow self-assignment.
    "no-self-assign": "warn",
    // Disallow comparisons where both sides are exactly the same.
    "no-self-compare": "warn",
    // Disallow unnecessary catch clauses.
    "no-useless-catch": "warn",
    // Disallow redundant return statements.
    "no-useless-return": "warn",
    // Disallow shadowing of names such as arguments.
    "no-shadow": "off",
    // Allow delete variable.
    "no-delete-var": "off",
    // Enforce consistent spacing inside array brackets.
    "array-bracket-spacing": "warn",
    // Enforce consistent brace style.
    "brace-style": "warn",
    // Enforce camelcase naming convention.
    "camelcase": "off",
    // Enforce consistent indentation.
    "indent": "off",
    // Enforce consistent quotation mark style for JSX attributes.
    // "jsx-quotes": "warn",
    // Enforce maximum depth that blocks can be nested.
    "max-depth": "warn",
    // Enforce a maximum line count.
    // "max-lines": ["warn", { "max": 1200 }],
    // Enforce a maximum line count per function.
    // "max-lines-per-function": ["warn", { max: 70 }],
    // Enforce a maximum number of statements allowed in function blocks.
    "max-statements": ["warn", 100],
    // Enforce a maximum nesting level for callbacks.
    "max-nested-callbacks": ["warn", 3],
    // Enforce a maximum number of parameters allowed in function definitions.
    "max-params": ["warn", 3],
    // Enforce a maximum number of statements per line.
    "max-statements-per-line": ["warn", { "max": 1 }],
    // Require a newline after each call when chaining calls.
    "newline-per-chained-call": ["warn", { "ignoreChainWithDepth": 3 }],
    // Disallow if as the only statement in an else block.
    "no-lonely-if": "warn",
    // Disallow mixed spaces and tabs for indentation.
    "no-mixed-spaces-and-tabs": "warn",
    // Disallow multiple empty lines.
    "no-multiple-empty-lines": ["warn", { "max": 1 }],
    // Disallow semicolons.
    "semi": ["warn", "always"],
    // Enforce consistent spacing before blocks.
    "space-before-blocks": "warn",
    // Enforce consistent spacing before function parentheses.
    // "space-before-function-paren": ["warn", "never"],
    // Enforce consistent spacing inside parentheses.
    "space-in-parens": "warn",
    // Require or disallow spaces around operators.
    "space-infix-ops": "warn",
    // Enforce consistent spacing before and after unary operators.
    "space-unary-ops": "warn",
    // Enforce consistent spacing in comments.
    // "spaced-comment": "warn",
    // Enforce consistent spacing after the // in a switch statement.
    "switch-colon-spacing": "warn",
    // Enforce consistent spacing before and after the arrow in arrow functions.
    "arrow-spacing": "warn",
    "prefer-const": "warn",
    "prefer-rest-params": "warn",
    "no-useless-escape": "off",
    "no-irregular-whitespace": "warn",
    "no-prototype-builtins": "off",
    "no-fallthrough": "warn",
    "no-extra-boolean-cast": "warn",
    "no-case-declarations": "off",
    "no-async-promise-executor": "warn",
    // Disallow non-null assertions (!).
    "@typescript-eslint/no-non-null-assertion": "warn",
    // Official React Hooks checks.
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error"
  },
};
