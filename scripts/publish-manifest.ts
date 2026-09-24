import { cpSync, existsSync, globSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildExports, getPublicPackages, type IPublicPackage } from './sync-package.ts';

const PUBLISH_FIELDS = [
    'name',
    'version',
    'description',
    'type',
    'sideEffects',
    'files',
    'keywords',
    'license',
    'homepage',
    'repository',
    'dependencies',
    'peerDependencies',
    'bugs',
] as const;

const hasGlobMagic = (pattern: string) => /[*?{}[\]]/.test(pattern);

/** Publish manifest built from a whitelist. Dev-only fields stay in the root package.json. */
export const buildPublishManifest = (source: object, packages: IPublicPackage[]): Record<string, unknown> => {
    const record = source as Record<string, unknown>;
    const manifest: Record<string, unknown> = {};

    PUBLISH_FIELDS.forEach(key => {
        if (record[key] !== undefined) {
            manifest[key] = record[key];
        }
    });

    manifest.exports = buildExports(packages);

    return manifest;
};

const copyPublishEntry = (packageRoot: string, publishRoot: string, pattern: string) => {
    if (!hasGlobMagic(pattern)) {
        const from = join(packageRoot, pattern);
        if (!existsSync(from)) {
            return;
        }

        cpSync(from, join(publishRoot, pattern), { recursive: statSync(from).isDirectory() });
        return;
    }

    globSync(pattern, { cwd: packageRoot }).forEach(relativePath => {
        const from = join(packageRoot, relativePath);
        if (!statSync(from).isFile()) {
            return;
        }

        const destination = join(publishRoot, relativePath);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(from, destination);
    });
};

/** Write `publish/package.json` and copy the `files` globs into `publish/`. */
export const writePublishPackage = (packageRoot: string): IPublicPackage[] => {
    const packageJsonPath = join(packageRoot, 'package.json');
    const source = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;
    const { files } = source;

    if (!Array.isArray(files) || files.some(entry => typeof entry !== 'string')) {
        throw new Error('package.json files must be a list of strings');
    }

    const packages = getPublicPackages(join(packageRoot, 'src'));
    const publishRoot = join(packageRoot, 'publish');

    rmSync(publishRoot, { recursive: true, force: true });
    mkdirSync(publishRoot, { recursive: true });

    files.forEach(pattern => {
        copyPublishEntry(packageRoot, publishRoot, pattern);
    });

    const manifest = buildPublishManifest(source, packages);
    writeFileSync(join(publishRoot, 'package.json'), `${JSON.stringify(manifest, null, 4)}\n`);

    return packages;
};

const isCli = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
    const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
    const packages = writePublishPackage(packageRoot);
    console.info(`Wrote publish manifest for: ${packages.map(pkg => pkg.name).join(', ') || '(none)'}`);
}
