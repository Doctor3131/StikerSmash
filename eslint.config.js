import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactNative from 'eslint-plugin-react-native';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  // 1. Base JavaScript Rules (from your original config)
  {
    // Apply to all JS/JSX/TS/TSX files
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],

    // Start with the recommended base rules from ESLint
    extends: [js.configs.recommended],

    languageOptions: {
      // React Native is an ESM project
      sourceType: 'module',
      // Set globals for both the browser-like React Native environment
      // and Node.js (for things like metro/scripts/tools)
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },

    // 2. Your Custom Rules (adjusted for React/RN)
    rules: {
      // ---------------- Style and Formatting ----------------
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',

      // ---------------- Best Practices & Code Quality ----------------
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],

      // Preserve your custom padding line rules
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'return', next: '*' },
        { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'switch', 'try'] },
        { blankLine: 'always', prev: ['if', 'for', 'while', 'switch', 'try'], next: '*' },
      ],
      // Disable default 'react/prop-types' rule as we use TypeScript/Flow
      // This is generally a good idea in modern React Native projects
      'react/prop-types': 'off',
    },
  },

  // 3. React Plugin Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // Recommended React rules (hooks, component naming, etc.)
    ...reactRecommended,
    // Rules for the new JSX transform (removes need to import React in every file)
    ...reactJSXRuntime,
    settings: {
      // Point the React plugin to the version you are using
      react: { version: 'detect' },
    },
  },

  // 4. React Native Plugin Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      // Enable common React Native best practices, e.g., disallowing inline styles
      'react-native/no-inline-styles': 'warn',
      // Add other specific React Native rules as needed, e.g.:
      // "react-native/no-unused-styles": "error",
      // "react-native/split-platform-components": "warn",
    },
  },

  // 5. TypeScript Support (Recommended)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Specify your project's tsconfig path
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Disable base ESLint rules that conflict with TypeScript equivalents
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // Enable TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Generally too strict for RN
      // Add other TypeScript rules...
    },
  },
]);
