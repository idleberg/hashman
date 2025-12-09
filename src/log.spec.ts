import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from './log.ts';

describe('logger', () => {
	beforeEach(() => {
		console.debug = vi.fn();
		console.error = vi.fn();
		console.info = vi.fn();
		console.log = vi.fn();
		console.warn = vi.fn();
	});

	const testMessages = [
		{ description: 'string', value: 'test message' },
		{ description: 'number', value: 42 },
		{ description: 'boolean', value: true },
		{ description: 'object', value: { key: 'value' } },
		{ description: 'array', value: [1, 2, 3] },
		{ description: 'undefined', value: undefined },
		{ description: 'null', value: null },
		{ description: 'Error', value: new Error('test error') },
	];

	describe('debug', () => {
		describe('when NODE_DEBUG is set', () => {
			beforeEach(() => {
				process.env.NODE_DEBUG = '1';
			});

			it.each(testMessages)('should handle $description messages', ({ value }) => {
				logger.debug(value);

				expect(console.debug).toHaveBeenCalledTimes(1);
				expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('DEBUG'), value);
			});
		});

		describe('when NODE_DEBUG is not set', () => {
			beforeEach(() => {
				delete process.env.NODE_DEBUG;
			});

			it.each(testMessages)('should not log $description messages', ({ value }) => {
				logger.debug(value);

				expect(console.debug).not.toHaveBeenCalled();
			});
		});
	});

	describe('error', () => {
		it.each(testMessages)('should handle $description messages', ({ value }) => {
			logger.error(value);

			expect(console.error).toHaveBeenCalledTimes(1);
			// log-symbols.error returns a symbol (✖)
			expect(console.error).toHaveBeenCalledWith(expect.anything(), value);
		});
	});

	describe('info', () => {
		it.each(testMessages)('should handle $description messages', ({ value }) => {
			logger.info(value);

			expect(console.info).toHaveBeenCalledTimes(1);
			// log-symbols.info returns a symbol (ℹ)
			expect(console.info).toHaveBeenCalledWith(expect.anything(), value);
		});
	});

	describe('success', () => {
		it.each(testMessages)('should handle $description messages', ({ value }) => {
			logger.success(value);

			expect(console.log).toHaveBeenCalledTimes(1);
			// log-symbols.success returns a symbol (✔)
			expect(console.log).toHaveBeenCalledWith(expect.anything(), value);
		});
	});

	describe('warn', () => {
		it.each(testMessages)('should handle $description messages', ({ value }) => {
			logger.warn(value);

			expect(console.warn).toHaveBeenCalledTimes(1);
			// log-symbols.warning returns a symbol (⚠)
			expect(console.warn).toHaveBeenCalledWith(expect.anything(), value);
		});
	});

	describe('log', () => {
		it.each(testMessages)('should handle $description messages without prefix', ({ value }) => {
			logger.log(value);

			expect(console.log).toHaveBeenCalledTimes(1);
			expect(console.log).toHaveBeenCalledWith(value);

			const callArgs = vi.mocked(console.log).mock.calls[0];
			expect(callArgs).toHaveLength(1);
		});
	});
});
