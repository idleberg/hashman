import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { HashingAlgorithm } from './hash.ts';
import workerFn from './worker.ts';

describe('worker', () => {
	const testDir = join(process.cwd(), 'test-temp');
	const testFile = join(testDir, 'test-file.txt');
	const testContent = 'Hello, World!';

	beforeEach(async () => {
		await mkdir(testDir, { recursive: true });
		await writeFile(testFile, testContent);
	});

	afterEach(async () => {
		await rm(testDir, { recursive: true, force: true });
	});

	describe('basic functionality', () => {
		it('should hash a file with MD5', async () => {
			const result = (await workerFn({ fileName: testFile, algorithm: 'md5' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result).toHaveProperty('MD5');
			expect(result.MD5).toBeDefined();
			const md5Result = result.MD5 as { hash: string; duration: string };
			expect(md5Result).toHaveProperty('hash');
			expect(md5Result).toHaveProperty('duration');
			expect(typeof md5Result.hash).toBe('string');
			expect(md5Result.hash).toHaveLength(32); // MD5 produces 32 hex characters
		});

		it('should hash a file with SHA256', async () => {
			const result = (await workerFn({ fileName: testFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result).toHaveProperty('SHA-256');
			expect(result['SHA-256']).toBeDefined();
			const sha256Result = result['SHA-256'] as { hash: string; duration: string };
			expect(sha256Result).toHaveProperty('hash');
			expect(sha256Result).toHaveProperty('duration');
			expect(typeof sha256Result.hash).toBe('string');
			expect(sha256Result.hash).toHaveLength(64); // SHA256 produces 64 hex characters
		});
	});

	describe('all algorithms', () => {
		const algorithms: HashingAlgorithm[] = [
			'crc32',
			'md5',
			'ripemd160',
			'sha1',
			'sha224',
			'sha256',
			'sha384',
			'sha512',
		];

		it.each(algorithms)('should hash a file with %s', async (algorithm) => {
			const result = (await workerFn({ fileName: testFile, algorithm })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			const keys = Object.keys(result);
			expect(keys).toHaveLength(1);

			const key = keys[0] as string;
			expect(result[key]).toBeDefined();
			const hashResult = result[key] as { hash: string; duration: string };
			expect(hashResult).toHaveProperty('hash');
			expect(hashResult).toHaveProperty('duration');
			expect(typeof hashResult.hash).toBe('string');
			expect(hashResult.hash.length).toBeGreaterThan(0);
		});
	});

	describe('duration measurement', () => {
		it('should measure duration as a numeric string', async () => {
			const result = (await workerFn({ fileName: testFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result['SHA-256']).toBeDefined();
			const sha256Result = result['SHA-256'] as { hash: string; duration: string };
			expect(sha256Result.duration).toMatch(/^\d+\.\d{2}$/);
			const duration = Number.parseFloat(sha256Result.duration);
			expect(duration).toBeGreaterThanOrEqual(0);
		});

		it('should format duration to 2 decimal places', async () => {
			const result = (await workerFn({ fileName: testFile, algorithm: 'md5' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result.MD5).toBeDefined();
			const md5Result = result.MD5 as { hash: string; duration: string };
			const durationParts = md5Result.duration.split('.');
			expect(durationParts).toHaveLength(2);
			expect(durationParts[1]).toHaveLength(2);
		});
	});

	describe('consistency', () => {
		it('should produce the same hash for the same file', async () => {
			const result1 = (await workerFn({ fileName: testFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;
			const result2 = (await workerFn({ fileName: testFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result1['SHA-256']).toBeDefined();
			expect(result2['SHA-256']).toBeDefined();
			const hash1 = (result1['SHA-256'] as { hash: string; duration: string }).hash;
			const hash2 = (result2['SHA-256'] as { hash: string; duration: string }).hash;
			expect(hash1).toBe(hash2);
		});

		it('should produce different hashes for different content', async () => {
			const result1 = (await workerFn({ fileName: testFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			const testFile2 = join(testDir, 'test-file-2.txt');
			await writeFile(testFile2, 'Different content');

			const result2 = (await workerFn({ fileName: testFile2, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result1['SHA-256']).toBeDefined();
			expect(result2['SHA-256']).toBeDefined();
			const hash1 = (result1['SHA-256'] as { hash: string; duration: string }).hash;
			const hash2 = (result2['SHA-256'] as { hash: string; duration: string }).hash;
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('error handling', () => {
		it('should throw error for non-existent file', async () => {
			const nonExistentFile = join(testDir, 'does-not-exist.txt');

			await expect(workerFn({ fileName: nonExistentFile, algorithm: 'sha256' })).rejects.toThrow();
		});
	});

	describe('file types', () => {
		it('should handle empty files', async () => {
			const emptyFile = join(testDir, 'empty.txt');
			await writeFile(emptyFile, '');

			const result = (await workerFn({ fileName: emptyFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result['SHA-256']).toBeDefined();
			const sha256Result = result['SHA-256'] as { hash: string; duration: string };
			expect(sha256Result).toHaveProperty('hash');
			expect(typeof sha256Result.hash).toBe('string');
			expect(sha256Result.hash.length).toBeGreaterThan(0);
		});

		it('should handle large text content', async () => {
			const largeContent = 'x'.repeat(1000000); // 1MB of content
			const largeFile = join(testDir, 'large.txt');
			await writeFile(largeFile, largeContent);

			const result = (await workerFn({ fileName: largeFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result['SHA-256']).toBeDefined();
			const sha256Result = result['SHA-256'] as { hash: string; duration: string };
			expect(sha256Result).toHaveProperty('hash');
			expect(typeof sha256Result.hash).toBe('string');
		});

		it('should handle binary content', async () => {
			const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe]);
			const binaryFile = join(testDir, 'binary.bin');
			await writeFile(binaryFile, binaryContent);

			const result = (await workerFn({ fileName: binaryFile, algorithm: 'sha256' })) as Record<
				string,
				{ hash: string; duration: string }
			>;

			expect(result['SHA-256']).toBeDefined();
			const sha256Result = result['SHA-256'] as { hash: string; duration: string };
			expect(sha256Result).toHaveProperty('hash');
			expect(typeof sha256Result.hash).toBe('string');
		});
	});
});
