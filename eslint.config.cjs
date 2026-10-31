module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', '.git/**', '.env*']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      prettier: require('eslint-plugin-prettier')
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: true, trailingComma: 'es5' }],
      'react/react-in-jsx-scope': 'off'
    }
  }
];
