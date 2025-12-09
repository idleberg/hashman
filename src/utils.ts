import { access, constants } from 'node:fs/promises';

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath, constants.F_OK);
	} catch {
		return false;
	}

	return true;
}

/**
 * Loads version from package manifest.
 * @internal
 */
export async function getVersion(): Promise<string> {
	const module = await import('../package.json', {
		with: { type: 'json' },
	});

	return module.default.version ?? 'development';
}

export function truncate(num: number): number {
	return Math.trunc(num * 1_000) / 1_000;
}
