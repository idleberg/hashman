import { describe, expect, it } from 'vitest';
import { getVersion } from './utils.ts';

describe('getVersion', () => {
	it('should return version from package.json', async () => {
		const version = await getVersion();

		expect(version).toMatch(/^\d+\.\d+\.\d+/);
	});

	it('should return a string', async () => {
		const version = await getVersion();

		expect(typeof version).toBe('string');
	});
});
