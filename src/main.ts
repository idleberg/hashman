import { stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { blue, grey, yellow } from 'kleur/colors';
import { Piscina } from 'piscina';
import prettyBytes from 'pretty-bytes';
import yoctoSpinner from 'yocto-spinner';
import { handleCli } from './cli.ts';
import { type HashingAlgorithm, type HashObject, hash } from './hash.ts';
import { logger } from './log.ts';

const WORKER_URL = process.env.WORKER_URL || new URL('./worker.mjs', import.meta.url).href;

const piscina = new Piscina({
	filename: WORKER_URL,
});

async function main() {
	const { args, options } = await handleCli();
	const fileName = args[0] as string;

	const algorithms: HashingAlgorithm[] = [];

	for (const [key, value] of Object.entries(options)) {
		if (value === true) {
			algorithms.push(key as HashingAlgorithm);
		}
	}

	const displayNames = Object.values(hash).map((h) => h.display);
	const maxLength = Math.max(...displayNames.map((a) => a.length));

	const startTime = performance.now();

	const spinner = yoctoSpinner({
		text: `Calculating ${algorithms.length === 1 ? 'checksum' : 'checksums'} for "${fileName}"`,
	}).start();

	const hashMap = await Promise.all(
		algorithms.map(async (algorithm) => {
			return await piscina.run({ fileName, algorithm });
		}),
	);

	const results: HashObject = Object.assign({}, ...hashMap);
	const { size } = await stat(fileName);

	spinner.stop();
	logger.log(/* let it breathe */);
	logger.log(yellow(basename(fileName)));
	logger.log('%s (%s bytes)', prettyBytes(size), size);
	logger.debug(`Using ${piscina.threads.length} worker threads`);
	logger.log(/* let it breathe */);

	for (const [algorithm, { hash, duration }] of Object.entries(results)) {
		const output = [`${algorithm.padEnd(maxLength)}`, blue(hash), grey(`${duration}ms`)];
		logger.info(output.join(' '));
	}

	const endTime = performance.now();

	logger.log(/** let it breathe */);
	logger.success(`Completed in ${(endTime - startTime).toFixed(2)}ms`);
}

await main();
