#!/usr/bin/env node
/**
 * Deploy this prebuilt CogSend. Workers Builds runs it (`npm run deploy`) on
 * every push to this repository.
 *
 * - The deploy is tagged with this release, so Settings and later deploys can
 *   tell what is running.
 * - It refuses to replace a newer release: once you update from Settings, this
 *   copy is older than your instance, and pushing to it must not roll you back.
 *   COGSEND_ALLOW_DOWNGRADE=1 (a build variable) overrides that.
 * - An account with no cron-trigger slot left still deploys; Settings →
 *   Scheduled publishing then offers an external tick instead.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { downgradeProblem, servingTag } from './lib/deployed-version.mjs';
import {
	NO_CRON_CONFIG_NAME,
	cronFallbackWarning,
	isCronQuotaError,
	parseJsonc,
	withoutCronTriggers
} from './lib/wrangler-config.mjs';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

function wrangler(args, { show = false } = {}) {
	const run = spawnSync('npx', ['wrangler', ...args], {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024
	});
	if (show) {
		process.stdout.write(run.stdout ?? '');
		process.stderr.write(run.stderr ?? '');
	}
	return { status: run.status, stdout: run.stdout ?? '', output: `${run.stdout}\n${run.stderr}` };
}

const allowDowngrade = ['1', 'true', 'yes'].includes(
	(process.env.COGSEND_ALLOW_DOWNGRADE ?? '').toLowerCase()
);
if (!allowDowngrade) {
	const problem = downgradeProblem(servingTag(wrangler).tag, version);
	if (problem) {
		console.error(problem);
		process.exit(1);
	}
}

const deployArgs = ['deploy', '--tag', `v${version}`, '--message', `CogSend ${version}`];
let result = wrangler(deployArgs, { show: true });
if (result.status !== 0 && isCronQuotaError(result.output)) {
	console.error(cronFallbackWarning());
	writeFileSync(
		NO_CRON_CONFIG_NAME,
		JSON.stringify(withoutCronTriggers(parseJsonc(readFileSync('wrangler.jsonc', 'utf8'))), null, '\t')
	);
	try {
		result = wrangler([...deployArgs, '--config', NO_CRON_CONFIG_NAME], { show: true });
	} finally {
		rmSync(NO_CRON_CONFIG_NAME, { force: true });
	}
}
process.exit(result.status ?? 1);
