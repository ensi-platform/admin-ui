import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildPublishManifest, writePublishPackage } from './publish-manifest';

const sourcePackage = {
    name: '@ensi-platform/admin-ui',
    version: '0.3.0',
    description: 'Admin UI',
    type: 'module',
    sideEffects: ['**/*.css', './dist/tokens/index.js'],
    files: ['dist', 'docs/ai.md', 'src/*/docs/Description.*.md', 'src/*/types.ts'],
    keywords: ['ensi'],
    license: 'SEE LICENSE IN LICENSE',
    homepage: 'https://ensi.tech',
    repository: { type: 'git', url: 'https://github.com/ensi-platform/admin-ui.git' },
    dependencies: { classnames: '2.5.1' },
    peerDependencies: { react: '^19' },
    bugs: { url: 'https://github.com/ensi-platform/admin-ui/issues' },
    engines: { node: '>=22.18.0' },
    scripts: { build: 'vite build' },
    devDependencies: { vitest: '^4' },
    packageManager: 'pnpm@10.14.0',
    private: true,
    publishConfig: { access: 'public', directory: 'publish' },
    exports: { './stale': { types: './dist/stale/index.d.ts', import: './dist/stale/index.js' } },
};

describe('buildPublishManifest', () => {
    it('keeps the publish whitelist and rebuilds exports', () => {
        const manifest = buildPublishManifest(sourcePackage, [{ name: 'button', entry: '/src/button/index.ts' }]);

        expect(manifest).toMatchObject({
            name: '@ensi-platform/admin-ui',
            version: '0.3.0',
            description: 'Admin UI',
            type: 'module',
            sideEffects: ['**/*.css', './dist/tokens/index.js'],
            files: sourcePackage.files,
            keywords: ['ensi'],
            license: 'SEE LICENSE IN LICENSE',
            homepage: 'https://ensi.tech',
            repository: sourcePackage.repository,
            dependencies: { classnames: '2.5.1' },
            peerDependencies: { react: '^19' },
            bugs: sourcePackage.bugs,
            exports: {
                './button': {
                    types: './dist/button/index.d.ts',
                    import: './dist/button/index.js',
                },
            },
        });
        expect(manifest).not.toHaveProperty('engines');
        expect(manifest).not.toHaveProperty('scripts');
        expect(manifest).not.toHaveProperty('devDependencies');
        expect(manifest).not.toHaveProperty('packageManager');
        expect(manifest).not.toHaveProperty('private');
        expect(manifest).not.toHaveProperty('publishConfig');
        expect(manifest.exports).not.toHaveProperty('./stale');
    });
});

describe('writePublishPackage', () => {
    it('writes a fresh manifest and copies only listed files', () => {
        const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-publish-'));
        mkdirSync(join(packageRoot, 'src/button/docs'), { recursive: true });
        mkdirSync(join(packageRoot, 'dist/button'), { recursive: true });
        mkdirSync(join(packageRoot, 'dist/tokens'), { recursive: true });
        mkdirSync(join(packageRoot, 'docs'), { recursive: true });

        writeFileSync(join(packageRoot, 'package.json'), `${JSON.stringify(sourcePackage, null, 4)}\n`);
        writeFileSync(join(packageRoot, 'src/button/index.ts'), 'export const Button = {};\n');
        writeFileSync(join(packageRoot, 'src/button/types.ts'), 'export type TButton = string;\n');
        writeFileSync(join(packageRoot, 'src/button/docs/Description.en.md'), '# Button\n');
        writeFileSync(join(packageRoot, 'src/secret.ts'), 'export const secret = true;\n');
        writeFileSync(join(packageRoot, 'docs/ai.md'), '# AI\n');
        writeFileSync(join(packageRoot, 'docs/notes.md'), '# Notes\n');
        writeFileSync(join(packageRoot, 'dist/button/index.js'), 'export const Button = {};\n');
        writeFileSync(join(packageRoot, 'dist/tokens/OFL.txt'), 'OFL\n');

        const packages = writePublishPackage(packageRoot);
        const publishRoot = join(packageRoot, 'publish');
        const manifest = JSON.parse(readFileSync(join(publishRoot, 'package.json'), 'utf8')) as {
            exports: Record<string, unknown>;
            engines?: unknown;
        };

        expect(packages.map(pkg => pkg.name)).toEqual(['button']);
        expect(manifest.exports).toEqual({
            './button': {
                types: './dist/button/index.d.ts',
                import: './dist/button/index.js',
            },
        });
        expect(manifest.engines).toBeUndefined();
        expect(readFileSync(join(publishRoot, 'docs/ai.md'), 'utf8')).toBe('# AI\n');
        expect(readFileSync(join(publishRoot, 'src/button/types.ts'), 'utf8')).toContain('TButton');
        expect(readFileSync(join(publishRoot, 'src/button/docs/Description.en.md'), 'utf8')).toBe('# Button\n');
        expect(readFileSync(join(publishRoot, 'dist/tokens/OFL.txt'), 'utf8')).toBe('OFL\n');
        expect(() => readFileSync(join(publishRoot, 'src/secret.ts'), 'utf8')).toThrow();
        expect(() => readFileSync(join(publishRoot, 'docs/notes.md'), 'utf8')).toThrow();
    });
});
