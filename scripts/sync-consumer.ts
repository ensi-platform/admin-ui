import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { syncAgentsToConsumer } from './sync-agents-consumer.ts';
import { syncSkillToConsumer } from './sync-skill-consumer.ts';

const isCli = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isCli) {
    try {
        const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
        const startDir = process.env.INIT_CWD || process.cwd();

        const skillResult = syncSkillToConsumer(packageRoot, startDir);
        if (skillResult.status === 'done') {
            skillResult.targets?.forEach(target => {
                if (target.status === 'written') {
                    console.info(`[admin-ui] skill synced to ${target.targetPath}`);
                }
            });
        }

        const agentsResult = syncAgentsToConsumer(packageRoot, startDir);
        if (agentsResult.status === 'written') {
            console.info(`[admin-ui] AGENTS.md updated at ${agentsResult.targetPath}`);
        }
    } catch (error) {
        // Never let a sync failure break `pnpm install` for the consumer.
        console.warn('[admin-ui] consumer sync skipped:', error instanceof Error ? error.message : error);
    }
}
