import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { resolveConsumerRoot } from './consumer-root.ts';

const AGENTS_TARGET_RELATIVE = 'AGENTS.md';

const BLOCK_START = '<!-- @ensi-platform/admin-ui:start -->';
const BLOCK_END = '<!-- @ensi-platform/admin-ui:end -->';

const BLOCK_BODY = [
    '## @ensi-platform/admin-ui',
    '',
    'When building or changing Ensi admin screens, forms, filters, or overlays, use `@ensi-platform/admin-ui` primitives.',
    'Before coding, read `node_modules/@ensi-platform/admin-ui/docs/ai.md` and the relevant',
    '`src/<name>/docs/Description.md` / `types.ts` — do not invent the API.',
    'For whole screens (lists, filters, detail pages) also follow `node_modules/@ensi-platform/admin-ui/docs/design-language.md`.',
].join('\n');

const buildBlock = (): string => `${BLOCK_START}\n${BLOCK_BODY}\n${BLOCK_END}`;

const resolveSeparator = (existing: string): string => {
    if (existing.endsWith('\n\n')) {
        return '';
    }

    if (existing.endsWith('\n')) {
        return '\n';
    }

    return '\n\n';
};

/** Replaces the marked block if present, otherwise appends it; never touches the rest of the file. */
const upsertBlock = (existing: string | undefined, block: string): string => {
    if (existing === undefined) {
        return `${block}\n`;
    }

    const startIndex = existing.indexOf(BLOCK_START);
    const endIndex = existing.indexOf(BLOCK_END);

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const before = existing.slice(0, startIndex);
        const after = existing.slice(endIndex + BLOCK_END.length);
        return `${before}${block}${after}`;
    }

    return `${existing}${resolveSeparator(existing)}${block}\n`;
};

export type TAgentsSyncStatus = 'skipped-env' | 'skipped-no-git-root' | 'skipped-dev-repo' | 'written' | 'unchanged';

export interface IAgentsSyncResult {
    status: TAgentsSyncStatus;
    targetPath?: string;
}

/**
 * Upserts a marker-delimited block in the consumer repo's `AGENTS.md`, so agents
 * without a Skills concept (Codex CLI, Copilot coding agent, …) still get a pointer
 * to `docs/ai.md`. Never overwrites content outside the marker block.
 */
export const syncAgentsToConsumer = (packageRoot: string, startDir: string): IAgentsSyncResult => {
    const root = resolveConsumerRoot(packageRoot, startDir);
    if (root.status !== 'ok') {
        return { status: root.status };
    }

    const targetPath = join(root.consumerRoot as string, AGENTS_TARGET_RELATIVE);
    const existing = existsSync(targetPath) ? readFileSync(targetPath, 'utf8') : undefined;
    const nextContent = upsertBlock(existing, buildBlock());

    if (existing === nextContent) {
        return { status: 'unchanged', targetPath };
    }

    writeFileSync(targetPath, nextContent);

    return { status: 'written', targetPath };
};
