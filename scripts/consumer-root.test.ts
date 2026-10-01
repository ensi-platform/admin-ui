import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveConsumerRoot } from './consumer-root';

describe('resolveConsumerRoot', () => {
    const originalEnv = process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
    let cleanupDirs: string[] = [];

    afterEach(() => {
        cleanupDirs.forEach(dir => rmSync(dir, { recursive: true, force: true }));
        cleanupDirs = [];
        if (originalEnv === undefined) {
            delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
            return;
        }
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = originalEnv;
    });

    it('skips when ADMIN_UI_SKIP_CONSUMER_SYNC is set', () => {
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = '1';
        const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-package-'));
        const consumerRoot = mkdtempSync(join(tmpdir(), 'admin-ui-consumer-'));
        cleanupDirs.push(packageRoot, consumerRoot);

        expect(resolveConsumerRoot(packageRoot, consumerRoot)).toEqual({ status: 'skipped-env' });
    });

    it('skips when no .git ancestor is found', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-package-'));
        const orphanDir = mkdtempSync(join(tmpdir(), 'admin-ui-orphan-'));
        cleanupDirs.push(packageRoot, orphanDir);

        expect(resolveConsumerRoot(packageRoot, orphanDir).status).toBe('skipped-no-git-root');
    });

    it('skips when consumerRoot resolves inside packageRoot (dev repo)', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-package-'));
        mkdirSync(join(packageRoot, '.git'));
        const nestedStartDir = join(packageRoot, 'scripts');
        mkdirSync(nestedStartDir, { recursive: true });
        cleanupDirs.push(packageRoot);

        expect(resolveConsumerRoot(packageRoot, nestedStartDir).status).toBe('skipped-dev-repo');
    });

    it('returns the nearest .git ancestor as consumerRoot', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-package-'));
        const consumerRoot = mkdtempSync(join(tmpdir(), 'admin-ui-consumer-'));
        mkdirSync(join(consumerRoot, '.git'));
        const nested = join(consumerRoot, 'apps/web/src');
        mkdirSync(nested, { recursive: true });
        cleanupDirs.push(packageRoot, consumerRoot);

        expect(resolveConsumerRoot(packageRoot, nested)).toEqual({ status: 'ok', consumerRoot });
    });
});
