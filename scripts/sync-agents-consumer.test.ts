import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { syncAgentsToConsumer } from './sync-agents-consumer';

const makePackageRoot = (): string => mkdtempSync(join(tmpdir(), 'admin-ui-package-'));

const makeConsumerRoot = (): string => {
    const consumerRoot = mkdtempSync(join(tmpdir(), 'admin-ui-consumer-'));
    mkdirSync(join(consumerRoot, '.git'));
    return consumerRoot;
};

describe('syncAgentsToConsumer', () => {
    const originalEnv = process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
            return;
        }
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = originalEnv;
    });

    it('creates AGENTS.md with the marker block when the file is missing', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = makePackageRoot();
        const consumerRoot = makeConsumerRoot();

        const result = syncAgentsToConsumer(packageRoot, consumerRoot);

        expect(result.status).toBe('written');
        const content = readFileSync(join(consumerRoot, 'AGENTS.md'), 'utf8');
        expect(content).toContain('<!-- @ensi-platform/admin-ui:start -->');
        expect(content).toContain('@ensi-platform/admin-ui');
        rmSync(packageRoot, { recursive: true, force: true });
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('appends the block to an existing AGENTS.md without touching the rest', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = makePackageRoot();
        const consumerRoot = makeConsumerRoot();
        writeFileSync(join(consumerRoot, 'AGENTS.md'), '# Team instructions\n\nDo X, do Y.\n');

        syncAgentsToConsumer(packageRoot, consumerRoot);

        const content = readFileSync(join(consumerRoot, 'AGENTS.md'), 'utf8');
        expect(content).toContain('Do X, do Y.');
        expect(content).toContain('<!-- @ensi-platform/admin-ui:start -->');
        rmSync(packageRoot, { recursive: true, force: true });
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('is idempotent: running twice does not duplicate the block', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = makePackageRoot();
        const consumerRoot = makeConsumerRoot();

        syncAgentsToConsumer(packageRoot, consumerRoot);
        const first = readFileSync(join(consumerRoot, 'AGENTS.md'), 'utf8');
        const result = syncAgentsToConsumer(packageRoot, consumerRoot);
        const second = readFileSync(join(consumerRoot, 'AGENTS.md'), 'utf8');

        expect(result.status).toBe('unchanged');
        expect(second).toBe(first);
        expect(second.match(/@ensi-platform\/admin-ui:start/g)).toHaveLength(1);
        rmSync(packageRoot, { recursive: true, force: true });
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('replaces only the marked block on update, preserving surrounding content', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const packageRoot = makePackageRoot();
        const consumerRoot = makeConsumerRoot();
        writeFileSync(
            join(consumerRoot, 'AGENTS.md'),
            [
                '# Team instructions',
                '',
                '<!-- @ensi-platform/admin-ui:start -->',
                'stale content',
                '<!-- @ensi-platform/admin-ui:end -->',
                '',
                'More team notes.',
                '',
            ].join('\n')
        );

        const result = syncAgentsToConsumer(packageRoot, consumerRoot);

        const content = readFileSync(join(consumerRoot, 'AGENTS.md'), 'utf8');
        expect(result.status).toBe('written');
        expect(content).not.toContain('stale content');
        expect(content).toContain('More team notes.');
        expect(content).toContain('# Team instructions');
        rmSync(packageRoot, { recursive: true, force: true });
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('skips when ADMIN_UI_SKIP_CONSUMER_SYNC is set', () => {
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = '1';
        const packageRoot = makePackageRoot();
        const consumerRoot = makeConsumerRoot();

        expect(syncAgentsToConsumer(packageRoot, consumerRoot)).toEqual({ status: 'skipped-env' });
        rmSync(packageRoot, { recursive: true, force: true });
        rmSync(consumerRoot, { recursive: true, force: true });
    });
});
