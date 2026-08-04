import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.mocha,
                // WebdriverIO injects these globally at runtime — do NOT import them.
                // See README § Page Object Conventions.
                browser: 'readonly',
                driver: 'readonly',
                multiremotebrowser: 'readonly',
                $: 'readonly',
                $$: 'readonly',
                expect: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'warn',
        },
    },
    {
        ignores: ['node_modules/**', 'allure-results/**', 'allure-report/**'],
    },
    eslintConfigPrettier,
];
