import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/** Env var to fully disable any consumer-repo sync (skills + AGENTS.md). */
export const SKIP_ENV_VAR = 'ADMIN_UI_SKIP_CONSUMER_SYNC';

/** Safety bound for walking up from `startDir` while looking for a `.git` root. */
const MAX_ANCESTOR_DEPTH = 20;

export type TRootStatus = 'skipped-env' | 'skipped-no-git-root' | 'skipped-dev-repo' | 'ok';

export interface IConsumerRootResult {
    status: TRootStatus;
    consumerRoot?: string;
}

/** Walks up from `startDir` looking for the nearest ancestor that contains `.git`. */
const findGitRoot = (startDir: string, maxDepth = MAX_ANCESTOR_DEPTH): string | undefined => {
    let dir = resolve(startDir);

    for (let i = 0; i < maxDepth; i += 1) {
        if (existsSync(join(dir, '.git'))) {
            return dir;
        }

        const parent = dirname(dir);
        if (parent === dir) {
            return undefined;
        }

        dir = parent;
    }

    return undefined;
};

/** True when `maybeChild` is `root` itself or nested inside it. */
const isInsideOrEqual = (root: string, maybeChild: string): boolean => {
    const normalizedRoot = resolve(root);
    const normalizedChild = resolve(maybeChild);

    return normalizedChild === normalizedRoot || normalizedChild.startsWith(`${normalizedRoot}/`);
};

/**
 * Resolves the consumer repo root (nearest `.git` ancestor of `startDir`), guarding
 * against the package's own dev install and against a full opt-out env var.
 * Shared by skill sync and AGENTS.md sync so both agree on the same root.
 */
export const resolveConsumerRoot = (packageRoot: string, startDir: string): IConsumerRootResult => {
    if (process.env[SKIP_ENV_VAR]) {
        return { status: 'skipped-env' };
    }

    const consumerRoot = findGitRoot(startDir);
    if (!consumerRoot) {
        return { status: 'skipped-no-git-root' };
    }

    // Running inside the admin-ui repo itself (dev install) — do not self-mirror.
    if (isInsideOrEqual(packageRoot, consumerRoot)) {
        return { status: 'skipped-dev-repo' };
    }

    return { status: 'ok', consumerRoot };
};
