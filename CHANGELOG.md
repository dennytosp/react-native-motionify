# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2026-08-11

### Fixed

- Corrected the `react-native-reanimated` peer range to `>=3.16.0`. The tab bar
  controls (`tabBar.show()` / `hide()` / `reset()`) call `SharedValue.set()`,
  which was added in Reanimated 3.16 — on 3.0 through 3.15 the declared range
  allowed an install that then threw `tabBarOverride.set is not a function` at
  runtime.
- The `LegendList` example in the README imported from `legendapp-ui`, which
  does not exist on npm. The package is `@legendapp/list`.

### Changed

- Removed the deprecated `@types/react-native` devDependency (React Native has
  shipped its own types since 0.71) and added `react`, `react-native`, and
  `react-native-reanimated` as explicit devDependencies so type checking no
  longer depends on the package manager auto-installing peers.

### Added

- MIT `LICENSE` file (the package was already declared MIT in `package.json`).
- Continuous integration: typecheck, unit tests, build, and package verification
  on every push and pull request.
- Unit tests for the pure helpers in `src/utils.ts`.
- Label-driven releases. A pull request labelled `release:minor` /
  `release:major` (or left unlabelled, for a patch) gets its version and
  CHANGELOG section written into the branch before merge; merging then
  publishes to npm with provenance, pushes the `v<version>` tag, and opens a
  GitHub Release from this file. `release:skip` publishes nothing.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue and pull request
  templates, and Dependabot configuration.

## [1.0.3] - 2026-02-27

### Changed

- `release` script for publishing, and `prepack` now builds through Bun.

## [1.0.2] - 2026-02-27

### Added

- Programmatic tab bar visibility controls via `tabBar.show()`, `tabBar.hide()`,
  and `tabBar.reset()` from `useMotionify()`, for cases where navigating
  programmatically would otherwise leave the tab bar hidden.

## [1.0.1] - 2025-10-31

### Fixed

- Crash caused by an invalid `Extrapolation` value passed to Reanimated.

### Added

- Demo video and expanded examples in the README.

## [1.0.0] - 2025-10-31

### Added

- Initial release: `MotionifyProvider`, `useMotionify`, `MotionifyView`,
  `MotionifyViewWithInterpolation`, `MotionifyBottomTab`,
  `MotionifyBottomTabWithInterpolation`, plus translation and interpolation
  presets and helper utilities.

[unreleased]: https://github.com/dennytosp/react-native-motionify/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/dennytosp/react-native-motionify/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/dennytosp/react-native-motionify/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dennytosp/react-native-motionify/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dennytosp/react-native-motionify/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dennytosp/react-native-motionify/releases/tag/v1.0.0
