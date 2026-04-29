import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import config from '@touchstone/eslint-config';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default [includeIgnoreFile(gitignorePath), ...config];
