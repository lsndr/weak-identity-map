module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:json/recommended',
    'prettier',
  ],
  ignorePatterns: ['**/dist/*', '/coverage', 'node_modules'],
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      parserOptions: {
        project: ['tsconfig.eslint.json'],
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'import/no-cycle': 'error',
        'import/no-unresolved': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        'no-implied-eval': 'off',
        '@typescript-eslint/no-implied-eval': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/unbound-method': 'error',
        'import/no-default-export': 'error',
        'eslint-comments/require-description': 'error',
        'eslint-comments/disable-enable-pair': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@theatre/**/*', '!@theatre/core'],
                message: 'Please use @theatre/core instead.',
              },
            ],
          },
        ],
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          typescript: {
            project: './tsconfig.eslint.json',
          },
        },
      },
      reportUnusedDisableDirectives: true,
    },
  ],
};
