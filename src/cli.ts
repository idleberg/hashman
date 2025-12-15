import { Command, type OptionValues } from 'commander';
import { logger } from './log.ts';
import { getVersion } from './utils.ts';

/**
 * Handles parsing of CLI arguments.
 * @internal
 */
export async function handleCli() {
	const program = new Command('hashman');

	program
		.version(await getVersion())
		.configureOutput({
			writeOut: (message: string) => logger.log(message),
			writeErr: (message: string) => logger.error(message),
		})
		.argument('<file...>', 'file to hash')
		.option('-A, --all', 'use all support hashes', false)
		.optionsGroup('Hashing Algorithms:')
		.option('--adler32', 'create Adler-32 hash', false)
		.option('--crc32', 'create CRC32 hash', false)
		.option('--crc32c', 'create CRC32C hash', false)
		.option('--crc64', 'create CRC64 hash', false)
		.option('--md4', 'create MD4 hash', false)
		.option('--md5', 'create MD5 hash', false)
		.option('--rmd160', 'create RIPEMD-160 hash', false)
		.option('--sha-1', 'create SHA-1 hash', false)
		.option('--sha-224', 'create SHA-224 hash', false)
		.option('--sha-256', 'create SHA-256 hash', false)
		.option('--sha-384', 'create SHA-384 hash', false)
		.option('--sha-512', 'create SHA-512 hash', false)
		.option('--sha3-224', 'create SHA3-224 hash', false)
		.option('--sha3-256', 'create SHA3-256 hash', false)
		.option('--sha3-384', 'create SHA3-384 hash', false)
		.option('--sha3-512', 'create SHA3-512 hash', false);

	program.parse();

	const args = program.args;
	const options = program.opts();

	logger.debug({ args, options });

	if (Object.values(options).filter(Boolean).length === 0) {
		logger.error('error: no hashing algorithm provided');
		logger.log(/** let it breathe */);

		program.outputHelp();
		process.exit(1);
	}

	return {
		args,
		options: mapOptions(options),
	};
}

function mapOptions(options: OptionValues) {
	if (options.all) {
		return {
			adler32: true,
			crc32: true,
			crc32c: true,
			crc64: true,
			md4: true,
			md5: true,
			ripemd160: true,
			sha1: true,
			sha224: true,
			sha256: true,
			sha384: true,
			sha512: true,
			sha3224: true,
			sha3256: true,
			sha3384: true,
			sha3512: true,

			// Cleanup
			all: undefined,
			rmd160: undefined,
		};
	}

	return {
		...options,

		// Cleanup
		all: undefined,
		rmd160: undefined,

		// Expand flag shortcut
		ripemd160: options.rmd160,
	};
}
