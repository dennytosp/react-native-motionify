# Contributing to react-native-motionify

Thanks for your interest in improving Motionify. This document covers how to get
the library running locally, what the checks are, and how releases work.

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to help

- **Report a bug** — use the [bug report template](https://github.com/dennytosp/react-native-motionify/issues/new?template=bug_report.yml).
  A minimal reproduction matters more than a long description.
- **Improve the docs** — if a prop, preset, or setup step confused you, it will
  confuse the next person. Doc PRs are always welcome.
- **Add a preset** — `TRANSLATION_PRESETS` and `INTERPOLATION_PRESETS` are the
  cheapest place to contribute something useful.
- **Fix a bug** — check the issue is not already assigned, then open a PR.

## Prerequisites

- [Bun](https://bun.sh) 1.1 or newer (the library's scripts run on Bun)
- Node.js 20 or newer (used by `npm pack` / publishing)
- For the example app: Xcode (iOS) and/or Android Studio, plus the
  [Reanimated 3 setup](https://docs.swmansion.com/react-native-reanimated/docs/3.x/fundamentals/getting-started)

## Local setup

```bash
git clone https://github.com/dennytosp/react-native-motionify.git
cd react-native-motionify
bun install
```

## The checks

These are exactly what CI runs on every pull request, so run them before pushing:

```bash
bun run typecheck   # tsc --noEmit over src/ and test/
bun test            # unit tests for the pure helpers in src/utils.ts
bun run build       # tsc -> lib/
```

`bun run dev` runs the compiler in watch mode while you work.

### About the tests

`src/utils.ts` is pure and therefore directly testable — clamping, lerping,
range mapping, and the interpolation-config builders all have coverage in
`test/utils.test.ts`. Because `react-native-reanimated` cannot be evaluated
outside a native runtime, `test/setup.ts` stubs the one thing the helpers need
from it (the `Extrapolation` enum).

The components in `MotionifyProvider`, `MotionifyView`, and
`MotionifyBottomTab` drive Reanimated worklets on the UI thread, so they are
verified on a device or simulator through the example app rather than in Jest.
If you change one, say which platform you tested on in your PR.

## Running the example app

The `example/` folder is an Expo app that consumes the library.

```bash
cd example
bun install
bun run ios       # or: bun run android
```

To test your local changes rather than the published package, point the example
at the repository root (`bun add ../` or a workspace link) and rebuild.

## Pull requests

1. Branch off `main`. Use a descriptive branch name, e.g. `fix/tab-bar-stuck-hidden`.
2. Keep the change focused — one logical change per PR reviews far faster.
3. Run the three checks above.
4. Fill in the PR template, including which platform you verified on.
5. If you change public API, update the README and add an entry to
   [CHANGELOG.md](./CHANGELOG.md) under `Unreleased`.

Commit messages in this repo use a gitmoji + short summary style
(`:sparkles: Add tab bar visibility controls`), but this is not enforced —
a clear message is what matters.

## Public API changes

Anything exported from `src/index.ts` is public API. Removing or renaming an
export, or changing a prop's meaning, is a breaking change and needs a major
version bump. Prefer adding an optional prop with a backwards-compatible default.

## Performance expectations

Motionify's reason to exist is that scroll animations stay on the UI thread.
When contributing to animated code paths:

- Keep worklets small; precompute anything heavy outside the worklet.
- Do not introduce `runOnJS` in a per-frame path.
- Do not add runtime dependencies. Reanimated, React, and React Native stay
  peer dependencies — the library ships with none of its own.

## Releasing

Merging a pull request into `main` is what releases. There is no separate
publish step to remember, and no version number to type.

**How the version is chosen.** Label the pull request:

| Label | 1.2.3 becomes | Use for |
| --- | --- | --- |
| *(none)* | `1.2.4` | bug fixes, docs, internals |
| `release:minor` | `1.3.0` | new options, presets, components |
| `release:major` | `2.0.0` | anything that breaks existing code |
| `release:skip` | unchanged | nothing published at all |

Anything exported from `src/index.ts` is public API, so removing or renaming an
export — or changing what a prop means — is `release:major`.

**What happens.** The [bump workflow](./.github/workflows/bump.yml) writes the
new version and moves your `Unreleased` CHANGELOG entries under it, committing
`:bookmark: Bump version to <version>` to the pull request branch. You see the
exact number and notes before merging, and can edit them.

Merging carries that commit onto `main`, where the
[release workflow](./.github/workflows/release.yml) sees a version the registry
does not have yet, re-runs typecheck/tests/build, publishes with provenance,
pushes the `v<version>` tag, and opens a GitHub Release from the CHANGELOG
section.

The target is always computed from `main`, never from the branch, so
re-labelling is safe: minor, then major, then minor again lands on the same
number it would have the first time.

**Two things worth knowing.**

CI does not re-run on the bump commit — pushes made with `GITHUB_TOKEN` do not
start workflow runs. That commit only rewrites the version field and moves a
CHANGELOG heading; the code CI verified is unchanged.

Pull requests from forks are not bumped, because the bot cannot push to a
fork's branch. Release those by bumping by hand after the merge, or by moving
the branch into this repository.

## Questions

Open a [Discussion](https://github.com/dennytosp/react-native-motionify/discussions)
for usage questions, and an issue for bugs.
