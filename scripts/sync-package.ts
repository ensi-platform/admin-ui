import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const EXCLUDED_PACKAGES = new Set(['ds', 'field-clear-button', 'calendar']);

/** Public entries that live under `src/ds/` but keep top-level package export names. */
const NESTED_PUBLIC_PACKAGES = [
    { name: 'tokens', entryRel: 'ds/tokens/index.ts' },
    { name: 'typography', entryRel: 'ds/typography/index.ts' },
] as const;

export interface IPublicPackage {
    name: string;
    entry: string;
}

export const getPublicPackages = (srcRoot: string): IPublicPackage[] => {
    const topLevel = readdirSync(srcRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .filter(name => !EXCLUDED_PACKAGES.has(name))
        .filter(name => existsSync(join(srcRoot, name, 'index.ts')))
        .map(name => ({
            name,
            entry: join(srcRoot, name, 'index.ts'),
        }));

    const nested = NESTED_PUBLIC_PACKAGES.filter(pkg => existsSync(join(srcRoot, pkg.entryRel))).map(pkg => ({
        name: pkg.name,
        entry: join(srcRoot, pkg.entryRel),
    }));

    return [...topLevel, ...nested].sort((a, b) => a.name.localeCompare(b.name));
};

export const getViteEntries = (packageRoot: string): Record<string, string> => {
    const srcRoot = join(packageRoot, 'src');
    const packages = getPublicPackages(srcRoot);

    return Object.fromEntries(packages.map(pkg => [`${pkg.name}/index`, pkg.entry]));
};

const buildExports = (packages: IPublicPackage[]) =>
    Object.fromEntries(
        packages.map(pkg => [
            `./${pkg.name}`,
            {
                types: `./dist/${pkg.name}/index.d.ts`,
                import: `./dist/${pkg.name}/index.js`,
            },
        ])
    );

export const syncPackage = (packageRoot: string) => {
    const srcRoot = join(packageRoot, 'src');
    const packages = getPublicPackages(srcRoot);
    const packageJsonPath = join(packageRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;

    packageJson.exports = buildExports(packages);
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);

    return packages;
};

const isCli = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
    const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
    const packages = syncPackage(packageRoot);
    console.info(`Synced exports for: ${packages.map(pkg => pkg.name).join(', ') || '(none)'}`);
}
