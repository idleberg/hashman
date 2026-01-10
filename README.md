# @idleberg/hashman

> Calculates multiple checksums at once.

[![License](https://img.shields.io/github/license/idleberg/hashman?color=blue&style=for-the-badge)](https://github.com/idleberg/hashman/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/@idleberg/hashman?style=for-the-badge)](https://www.npmjs.org/package/@idleberg/hashman)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/hashman/main?style=for-the-badge)

Here's a tool that I personally use a lot. It concurrently calculates checksums of a file in a variety of formats. Supports Adler-32, CRC32, CRC32C, CRC64, MD4, MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-224, SHA3-256, SHA3-384, and SHA3-512.

The name is inspired by [Hashman Deejay](https://futuretimes.bandcamp.com/album/sandopolis), whose music I love listening to while creating things.

## Installation 💿

```shell
npm install --global @idleberg/hashman
```

## Usage 🚀

```shell
npx hashman --all "Hashman Deejay - Sandopolis.zip"
```

See `npx hashman --help` for all available options.

## License ©️

This work is licensed under [The MIT License](LICENSE).
