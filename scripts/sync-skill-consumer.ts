import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { resolveConsumerRoot } from './consumer-root.ts';

/** Published skill doc inside this package. */
const SKILL_SOURCE_RELATIVE = 'docs/skills/SKILL.md';

/** Where skills-aware agents look for this skill in the consumer repo. */
const SKILL_TARGETS_RELATIVE = ['.cursor/skills/admin-ui/SKILL.md', '.claude/skills/admin-ui/SKILL.md'];

export interface ITargetResult {
    targetPath: string;
    status: 'written' | 'unchanged';
}

export type TSkillSyncStatus =
    'skipped-env' | 'skipped-no-git-root' | 'skipped-dev-repo' | 'skipped-no-source' | 'done';

export interface ISkillSyncResult {
    status: TSkillSyncStatus;
    targets?: ITargetResult[];
}

const writeIfChanged = (targetPath: string, content: string): ITargetResult => {
    if (existsSync(targetPath) && readFileSync(targetPath, 'utf8') === content) {
        return { targetPath, status: 'unchanged' };
    }

    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, content);

    return { targetPath, status: 'written' };
};

/**
 * Copies the published skill doc into every known skills-aware agent directory
 * in the consumer repo (Cursor, Claude Code), so they pick it up without manual
 * setup. Never throws — a consumer's install must never fail because of this.
 */
export const syncSkillToConsumer = (packageRoot: string, startDir: string): ISkillSyncResult => {
    const root = resolveConsumerRoot(packageRoot, startDir);
    if (root.status !== 'ok') {
        return { status: root.status };
    }

    const sourcePath = join(packageRoot, SKILL_SOURCE_RELATIVE);
    if (!existsSync(sourcePath)) {
        return { status: 'skipped-no-source' };
    }

    const content = readFileSync(sourcePath, 'utf8');
    const consumerRoot = root.consumerRoot as string;
    const targets = SKILL_TARGETS_RELATIVE.map(relative => writeIfChanged(join(consumerRoot, relative), content));

    return { status: 'done', targets };
};
