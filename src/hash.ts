import {
	createAdler32,
	createCRC32,
	createCRC64,
	createMD4,
	createMD5,
	createRIPEMD160,
	createSHA1,
	createSHA3,
	createSHA224,
	createSHA256,
	createSHA384,
	createSHA512,
} from 'hash-wasm';

export type HashingAlgorithm =
	| 'crc32'
	| 'crc32c'
	| 'crc64'
	| 'md5'
	| 'ripemd160'
	| 'sha1'
	| 'sha224'
	| 'sha256'
	| 'sha384'
	| 'sha512'
	| 'sha3224'
	| 'sha3256'
	| 'sha3384'
	| 'sha3512';

export type HashObject = {
	[K in HashingAlgorithm]: {
		hash: string;
		duration: string;
	};
};

export const hash = {
	adler32: { fn: createAdler32, display: 'Adler-32' },
	crc32: { fn: createCRC32, display: 'CRC32' },
	crc32c: { fn: () => createCRC32(0x82f63b78), display: 'CRC32C' },
	crc64: { fn: createCRC64, display: 'CRC64' },
	md4: { fn: createMD4, display: 'MD4' },
	md5: { fn: createMD5, display: 'MD5' },
	ripemd160: { fn: createRIPEMD160, display: 'RIPEMD-160' },
	sha1: { fn: createSHA1, display: 'SHA-1' },
	sha224: { fn: createSHA224, display: 'SHA-224' },
	sha256: { fn: createSHA256, display: 'SHA-256' },
	sha384: { fn: createSHA384, display: 'SHA-384' },
	sha512: { fn: createSHA512, display: 'SHA-512' },
	sha3224: { fn: () => createSHA3(224), display: 'SHA3-224' },
	sha3256: { fn: () => createSHA3(256), display: 'SHA3-256' },
	sha3384: { fn: () => createSHA3(384), display: 'SHA3-384' },
	sha3512: { fn: () => createSHA3(512), display: 'SHA3-512' },
} as const;
