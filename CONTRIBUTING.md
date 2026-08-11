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

Maintainers only. Merging a version bump into `main` is what releases —
there is no separate publish step to remember.

1. In a pull request: move the `Unreleased` entries in `CHANGELOG.md` under the
   new version, and bump `package.json`.

   ```bash
   npm version minor --no-git-tag-version   # or patch / major
   ```

   `--no-git-tag-version` matters: the tag is created by CI after a successful
   publish, so it never points at a release that failed halfway.

2. Merge the pull request.

The [Release workflow](./.github/workflows/release.yml) then compares
`package.json` against the registry. If that version is already on npm it stops;
otherwise it re-runs typecheck, tests and build, publishes with provenance,
pushes the `v<version>` tag, and opens a GitHub Release using the matching
`CHANGELOG.md` section.

Choosing the version number stays a human decision — nothing infers semver from
commit messages. Note that anything exported from `src/index.ts` is public API
(see above), so removals and renames need a major bump.

## Questions

Open a [Discussion](https://github.com/dennytosp/react-native-motionify/discussions)
for usage questions, and an issue for bugs.
