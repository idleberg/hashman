/** @import { HashingAlgorithm } from './hash.ts' */
import { readFile } from 'node:fs/promises';
import { hash } from './hash.ts';

/**
 * Hashes a file using the specified algorithm and measures the duration.
 * @param {{ fileName: string, algorithm: HashingAlgorithm }} params - The parameters object
 * @returns {Promise<Object>} An object with the algorithm display name as key, containing hash and duration
 */
export default async ({ fileName, algorithm }) => {
	const contents = await readFile(fileName);

	const startTime = performance.now();
	const fileHash = await hash[algorithm].fn(contents);
	const endTime = performance.now();

	return {
		[hash[algorithm].display]: {
			hash: fileHash,
			duration: (endTime - startTime).toFixed(2),
		},
	};
};
