import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts', '*.mts', '*.cts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enforce kebab-case for file names
      // Note: ESLint doesn't have built-in file naming rules, so this would be enforced via tooling or manual review
      // Enforcing camelCase for function names and variables
      'camelcase': ['error', {
        properties: 'never',
        ignoreDestructuring: false,
        allow: ['^UNSAFE_'],
      }],
      // Enforce PascalCase for type names (handled by @typescript-eslint/naming-convention)
      '@typescript-eslint/naming-convention': [
        'error',
        // Functions must be camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // Variables must be camelCase
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // Type-like constructs must be PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Interfaces must be PascalCase
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        // Type aliases must be PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // Enum members can be PascalCase or UPPER_CASE
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
      ],
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.pnpm-store/**'],
  }
);
