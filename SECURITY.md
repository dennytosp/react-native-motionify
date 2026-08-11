# Security Policy

## Supported versions

Security fixes land on the latest published minor release. Older versions are
not patched — please upgrade before reporting.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/dennytosp/react-native-motionify/security/advisories/new),
or by email to **phong.dinh2108@gmail.com**.

Please include:

- The affected version of `react-native-motionify`
- A description of the issue and its impact
- Steps to reproduce, ideally with a minimal snippet

### What to expect

- **Acknowledgement** within 5 working days.
- An assessment and a plan (fix, mitigation, or "not a vulnerability, and why")
  within 14 days.
- Credit in the release notes when the fix ships, unless you prefer otherwise.

## Scope

`react-native-motionify` is a UI animation library. It ships no runtime
dependencies, performs no network or filesystem access, and does not handle
credentials or user data. Realistic reports in scope include supply-chain issues
with the published npm package (tampered tarball, compromised release workflow)
and code paths that could be abused to crash or hang an app.

Vulnerabilities in `react-native-reanimated`, React Native, or Expo should be
reported to those projects directly.
