import { createReadStream } from 'node:fs';
import { type HashingAlgorithm, hash } from './hash.ts';

/**
 * Hashes a file using the specified algorithm and measures the duration.
 * Uses streaming to support large files (2GB+) without loading the entire file into memory.
 * @param params - The parameters object
 * @returns {Promise<Object>} An object with the algorithm display name as key, containing hash and duration
 */
export default async ({ fileName, algorithm }: { fileName: string; algorithm: HashingAlgorithm }) => {
	const startTime = performance.now();

	// Create hasher instance
	const hasher = await hash[algorithm].fn();
	hasher.init();

	// Create read stream and process file in chunks
	const stream = createReadStream(fileName, { highWaterMark: 1024 * 1024 }); // 1MB chunks

	for await (const chunk of stream) {
		hasher.update(chunk);
	}

	// Finalize and get the hash
	const fileHash = hasher.digest();
	const endTime = performance.now();

	return {
		[hash[algorithm].display]: {
			hash: fileHash,
			duration: (endTime - startTime).toFixed(2),
		},
	};
};
