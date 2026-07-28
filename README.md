# Go Hashman!

> CLI for concurrent checksum calculation.

![License](https://img.shields.io/github/license/idleberg/go-hashman?style=for-the-badge)
![Version](https://img.shields.io/github/v/release/idleberg/go-hashman?sort=semver&style=for-the-badge)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/go-hashman/build.yml?style=for-the-badge)](https://github.com/idleberg/go-hashman/actions)

Supports Adler-32, CRC32, CRC32C, CRC64, MD4, MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA3-224, SHA3-256, SHA3-384, and SHA3-512.

The name is a nod to [Hashman Deejay](https://futuretimes.bandcamp.com/album/sandopolis), whose music I love listening to while creating things.

## Installation 💿

### Homebrew

```sh
$ brew install idleberg/asahi/hashman
```

### Winget

```sh
$ winget install idleberg.hashman
```

### Go

```sh
$ go install github.com/idleberg/go-hashman@latest
```

## Usage 🚀

```shell
hashman --all "Hashman Deejay - Sandopolis.zip"
```

See `hashman --help` for all available options.

## Benchmark ⏱️

Oh right, this CLI is a clone of my own NodeJS implementation. Let's check how they compare in terms of speed:

```
Benchmark 1: node-hashman -A "Josey Rebelle - TTT Mix.mp3"
  Time (mean ± σ):      1.354 s ±  0.019 s    [User: 8.719 s, System: 1.094 s]
  Range (min … max):    1.328 s …  1.391 s    10 runs
 
Benchmark 2: go-hashman -A "Josey Rebelle - TTT Mix.mp3"
  Time (mean ± σ):     745.9 ms ±  16.7 ms    [User: 3770.0 ms, System: 497.5 ms]
  Range (min … max):   718.7 ms … 767.1 ms    10 runs
 
Summary
  go-hashman -A "Josey Rebelle - TTT Mix.mp3" ran
    1.82 ± 0.05 times faster than node-hashman -A "Josey Rebelle - TTT Mix.mp3"
```

## Related 👫

- [@idleberg/hashman](https://www.npmjs.com/package/@idleberg/hashman) - NodeJS implementation of this package

## License ©️

This work is licensed under [The MIT License](LICENSE).
