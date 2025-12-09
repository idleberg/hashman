import {
	createAdler32,
	createCRC32,
	createMD4,
	createMD5,
	createRIPEMD160,
	createSHA1,
	createSHA224,
	createSHA256,
	createSHA384,
	createSHA512,
} from 'hash-wasm';

export type HashingAlgorithm = 'crc32' | 'md5' | 'ripemd160' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512';
export type HashObject = {
	[K in HashingAlgorithm]: {
		hash: string;
		duration: string;
	};
};

export const hash = {
	adler32: { fn: createAdler32, display: 'Adler-32' },
	crc32: { fn: createCRC32, display: 'CRC32' },
	md4: { fn: createMD4, display: 'MD4' },
	md5: { fn: createMD5, display: 'MD5' },
	ripemd160: { fn: createRIPEMD160, display: 'RIPEMD-160' },
	sha1: { fn: createSHA1, display: 'SHA-1' },
	sha224: { fn: createSHA224, display: 'SHA-224' },
	sha256: { fn: createSHA256, display: 'SHA-256' },
	sha384: { fn: createSHA384, display: 'SHA-384' },
	sha512: { fn: createSHA512, display: 'SHA-512' },
} as const;
