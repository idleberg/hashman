import { describe, expect, it } from 'vitest';
import { type HashingAlgorithm, hash } from './hash.ts';

describe('hash', () => {
	describe('structure', () => {
		it('should contain all expected algorithms', () => {
			const expectedAlgorithms = [
				'adler32',
				'crc32',
				'crc32c',
				'crc64',
				'md4',
				'md5',
				'ripemd160',
				'sha1',
				'sha224',
				'sha256',
				'sha384',
				'sha512',
				'sha3224',
				'sha3256',
				'sha3384',
				'sha3512',
			];

			expect(Object.keys(hash)).toEqual(expectedAlgorithms);
		});

		it('should have fn and display properties for each algorithm', () => {
			Object.entries(hash).forEach(([_key, value]) => {
				expect(value).toHaveProperty('fn');
				expect(value).toHaveProperty('display');
				expect(typeof value.fn).toBe('function');
				expect(typeof value.display).toBe('string');
			});
		});
	});

	describe('display names', () => {
		const expectedDisplayNames = {
			adler32: 'Adler-32',
			crc32: 'CRC32',
			crc32c: 'CRC32C',
			crc64: 'CRC64',
			md4: 'MD4',
			md5: 'MD5',
			ripemd160: 'RIPEMD-160',
			sha1: 'SHA-1',
			sha224: 'SHA-224',
			sha256: 'SHA-256',
			sha384: 'SHA-384',
			sha512: 'SHA-512',
			sha3224: 'SHA3-224',
			sha3256: 'SHA3-256',
			sha3384: 'SHA3-384',
			sha3512: 'SHA3-512',
		};

		it.each(Object.entries(expectedDisplayNames))(
			'should have correct display name for %s',
			(algorithm, displayName) => {
				expect(hash[algorithm as keyof typeof hash].display).toBe(displayName);
			},
		);
	});

	describe('hash functions', () => {
		const testData = 'test content';

		it('should compute CRC32 hash', async () => {
			const hasher = await hash.crc32.fn();

			hasher.init();

			hasher.update(testData);
			const result = hasher.digest();

			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
			expect(result).toHaveLength(8); // CRC32 produces 8 hex characters
		});

		it('should compute MD5 hash', async () => {
			const hasher = await hash.md5.fn();

			hasher.init();
			hasher.update(testData);

			const result = hasher.digest();

			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
			expect(result).toHaveLength(32); // MD5 produces 32 hex characters
		});

		it('should compute SHA256 hash', async () => {
			const hasher = await hash.sha256.fn();

			hasher.init();
			hasher.update(testData);

			const result = hasher.digest();

			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
			expect(result).toHaveLength(64); // SHA256 produces 64 hex characters
		});

		it('should produce consistent results for same input', async () => {
			const hasher1 = await hash.sha256.fn();
			hasher1.init();
			hasher1.update(testData);
			const result1 = hasher1.digest();

			const hasher2 = await hash.sha256.fn();
			hasher2.init();
			hasher2.update(testData);
			const result2 = hasher2.digest();

			expect(result1).toBe(result2);
		});

		it('should produce different results for different inputs', async () => {
			const hasher1 = await hash.sha256.fn();

			hasher1.init();
			hasher1.update(testData);

			const result1 = hasher1.digest();

			const hasher2 = await hash.sha256.fn();

			hasher2.init();
			hasher2.update('different content');

			const result2 = hasher2.digest();

			expect(result1).not.toBe(result2);
		});
	});

	describe('HashingAlgorithm type', () => {
		it('should allow valid algorithm names', () => {
			const validAlgorithms: HashingAlgorithm[] = [
				'crc32',
				'md5',
				'ripemd160',
				'sha1',
				'sha224',
				'sha256',
				'sha384',
				'sha512',
			];

			validAlgorithms.forEach((algorithm) => {
				expect(hash[algorithm]).toBeDefined();
			});
		});
	});
});
