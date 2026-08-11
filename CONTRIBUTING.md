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

Source pull requests never bump their own version. After a merge into `main`,
the default decision is patch when no `release:*` label is present; use
`release:minor`, `release:major`, or `release:skip` to override it. Automation
then prepares a separate `release/next` pull request whose merge publishes.

Read [RELEASING.md](./RELEASING.md) for the complete rules and copy-pasteable
`gh` commands for creating, applying, changing, and verifying release labels.

## Questions

Open a [Discussion](https://github.com/dennytosp/react-native-motionify/discussions)
for usage questions, and an issue for bugs.
