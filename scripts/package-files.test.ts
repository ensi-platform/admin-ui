import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const REQUIRED_GLOBS = [
    'docs/design-language.md',
    'src/docs/getting-started/Description.md',
    'src/docs/ai/Description.md',
] as const;

const readFiles = (): string[] => {
    const source = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as { files: string[] };

    return source.files;
};

describe('package.json files', () => {
    it('publishes design-language and onboarding docs', () => {
        const files = readFiles();

        REQUIRED_GLOBS.forEach(pattern => {
            expect(files).toContain(pattern);
        });
    });

    it('publishes english Description.md from the repo en sources', () => {
        const files = readFiles();

        expect(
            files.some(pattern => pattern.includes('Description.ru.md') || pattern.includes('Description.*.md'))
        ).toBe(false);
        expect(existsSync(join(packageRoot, 'docs/design-language.en.md'))).toBe(true);
        expect(existsSync(join(packageRoot, 'docs/architecture.en.md'))).toBe(true);
        expect(existsSync(join(packageRoot, 'src/ds/tokens/docs/Description.en.md'))).toBe(true);
        expect(existsSync(join(packageRoot, 'src/docs/getting-started/Description.en.md'))).toBe(true);
        expect(existsSync(join(packageRoot, 'src/docs/ai/Description.en.md'))).toBe(true);
        expect(files).toContain('src/ds/tokens/docs/Description.md');
    });
});
