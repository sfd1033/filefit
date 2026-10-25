import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
import ts from 'eslint-config-next/typescript';
export default defineConfig([...next, ...ts, globalIgnores(['out/**','.next/**','public/pdf.worker.min.mjs','playwright-report/**','test-results/**'])]);
