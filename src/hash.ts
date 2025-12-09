import { adler32, crc32, md4, md5, ripemd160, sha1, sha224, sha256, sha384, sha512 } from 'hash-wasm';

export type HashingAlgorithm = 'crc32' | 'md5' | 'ripemd160' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512';
export type HashObject = {
	[K in HashingAlgorithm]: {
		hash: string;
		duration: string;
	};
};

export const hash = {
	adler32: { fn: adler32, display: 'Adler-32' },
	crc32: { fn: crc32, display: 'CRC32' },
	md4: { fn: md4, display: 'MD4' },
	md5: { fn: md5, display: 'MD5' },
	ripemd160: { fn: ripemd160, display: 'RIPEMD-160' },
	sha1: { fn: sha1, display: 'SHA-1' },
	sha224: { fn: sha224, display: 'SHA-224' },
	sha256: { fn: sha256, display: 'SHA-256' },
	sha384: { fn: sha384, display: 'SHA-384' },
	sha512: { fn: sha512, display: 'SHA-512' },
} as const;
