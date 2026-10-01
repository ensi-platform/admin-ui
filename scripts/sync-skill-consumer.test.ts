import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { syncSkillToConsumer } from './sync-skill-consumer';

const SKILL_CONTENT = '# admin-ui skill\n';
const CURSOR_TARGET = '.cursor/skills/admin-ui/SKILL.md';
const CLAUDE_TARGET = '.claude/skills/admin-ui/SKILL.md';

const makePackageRoot = (): string => {
    const packageRoot = mkdtempSync(join(tmpdir(), 'admin-ui-package-'));
    mkdirSync(join(packageRoot, 'docs/skills'), { recursive: true });
    writeFileSync(join(packageRoot, 'docs/skills/SKILL.md'), SKILL_CONTENT);
    return packageRoot;
};

const makeConsumerRoot = (): string => {
    const consumerRoot = mkdtempSync(join(tmpdir(), 'admin-ui-consumer-'));
    mkdirSync(join(consumerRoot, '.git'));
    return consumerRoot;
};

describe('syncSkillToConsumer', () => {
    const originalEnv = process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
    let packageRoot: string;

    beforeEach(() => {
        packageRoot = makePackageRoot();
    });

    afterEach(() => {
        rmSync(packageRoot, { recursive: true, force: true });
        if (originalEnv === undefined) {
            delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
            return;
        }
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = originalEnv;
    });

    it('skips when ADMIN_UI_SKIP_CONSUMER_SYNC is set', () => {
        process.env.ADMIN_UI_SKIP_CONSUMER_SYNC = '1';
        const consumerRoot = makeConsumerRoot();

        expect(syncSkillToConsumer(packageRoot, consumerRoot)).toEqual({ status: 'skipped-env' });
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('skips when no .git ancestor is found', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const orphanDir = mkdtempSync(join(tmpdir(), 'admin-ui-orphan-'));

        expect(syncSkillToConsumer(packageRoot, orphanDir).status).toBe('skipped-no-git-root');
        rmSync(orphanDir, { recursive: true, force: true });
    });

    it('skips when consumerRoot resolves inside packageRoot (dev repo)', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        mkdirSync(join(packageRoot, '.git'));
        const nestedStartDir = join(packageRoot, 'scripts');
        mkdirSync(nestedStartDir, { recursive: true });

        expect(syncSkillToConsumer(packageRoot, nestedStartDir).status).toBe('skipped-dev-repo');
    });

    it('skips when the package has no docs/skills/SKILL.md', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        rmSync(join(packageRoot, 'docs/skills/SKILL.md'));
        const consumerRoot = makeConsumerRoot();

        expect(syncSkillToConsumer(packageRoot, consumerRoot).status).toBe('skipped-no-source');
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('writes the skill file into both .cursor/skills and .claude/skills', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const consumerRoot = makeConsumerRoot();

        const result = syncSkillToConsumer(packageRoot, consumerRoot);

        expect(result.status).toBe('done');
        expect(result.targets).toEqual([
            { targetPath: join(consumerRoot, CURSOR_TARGET), status: 'written' },
            { targetPath: join(consumerRoot, CLAUDE_TARGET), status: 'written' },
        ]);
        expect(readFileSync(join(consumerRoot, CURSOR_TARGET), 'utf8')).toBe(SKILL_CONTENT);
        expect(readFileSync(join(consumerRoot, CLAUDE_TARGET), 'utf8')).toBe(SKILL_CONTENT);
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('does not rewrite files when content is already up to date', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const consumerRoot = makeConsumerRoot();
        syncSkillToConsumer(packageRoot, consumerRoot);

        const result = syncSkillToConsumer(packageRoot, consumerRoot);

        expect(result.targets).toEqual([
            { targetPath: join(consumerRoot, CURSOR_TARGET), status: 'unchanged' },
            { targetPath: join(consumerRoot, CLAUDE_TARGET), status: 'unchanged' },
        ]);
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('updates both files when the source content changed', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const consumerRoot = makeConsumerRoot();
        syncSkillToConsumer(packageRoot, consumerRoot);

        writeFileSync(join(packageRoot, 'docs/skills/SKILL.md'), '# updated\n');
        const result = syncSkillToConsumer(packageRoot, consumerRoot);

        expect(result.targets?.every(target => target.status === 'written')).toBe(true);
        expect(readFileSync(join(consumerRoot, CURSOR_TARGET), 'utf8')).toBe('# updated\n');
        expect(readFileSync(join(consumerRoot, CLAUDE_TARGET), 'utf8')).toBe('# updated\n');
        rmSync(consumerRoot, { recursive: true, force: true });
    });

    it('finds the .git root from a nested start directory', () => {
        delete process.env.ADMIN_UI_SKIP_CONSUMER_SYNC;
        const consumerRoot = makeConsumerRoot();
        const nested = join(consumerRoot, 'apps/web/src');
        mkdirSync(nested, { recursive: true });

        const result = syncSkillToConsumer(packageRoot, nested);

        expect(result.status).toBe('done');
        expect(existsSync(join(consumerRoot, CURSOR_TARGET))).toBe(true);
        expect(existsSync(join(consumerRoot, CLAUDE_TARGET))).toBe(true);
        rmSync(consumerRoot, { recursive: true, force: true });
    });
});
