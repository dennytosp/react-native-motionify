# Releasing

Releases are selected with pull request labels. Pull request titles and commit
messages do not determine the version.

## Release decisions

Choose exactly one release decision for every pull request targeting `main`:

| Decision | Pull request label | `1.2.3` becomes | Use for |
| --- | --- | --- | --- |
| Patch | No `release:*` label | `1.2.4` | Backwards-compatible fixes and small internal changes |
| Minor | `release:minor` | `1.3.0` | Backwards-compatible features, props, presets, or components |
| Major | `release:major` | `2.0.0` | Breaking changes to public exports or behavior |
| Skip | `release:skip` | Unchanged | Changes that must not publish a new npm version |

Patch is the default. There is intentionally no `release:patch` label.

Only one `release:*` label should be present. `release:skip` prevents the bump
job, and `release:major` takes precedence over `release:minor` if conflicting
labels are accidentally applied.

## One-time label setup

Run these commands once from the repository checkout. `--force` also repairs
the description or color if the label already exists.

```bash
gh auth status

gh label create "release:minor" \
  --color "1D76DB" \
  --description "Publish the next minor version after merge" \
  --force

gh label create "release:major" \
  --color "B60205" \
  --description "Publish the next major version after merge" \
  --force

gh label create "release:skip" \
  --color "6A737D" \
  --description "Do not publish a new npm version after merge" \
  --force
```

If `gh auth status` reports an expired or missing login, run `gh auth login`
before creating or editing labels.

## Apply a decision to a pull request

Set the pull request number once:

```bash
PR_NUMBER=123
```

### Patch

Patch is represented by removing every release label:

```bash
gh pr edit "$PR_NUMBER" \
  --remove-label "release:minor,release:major,release:skip"
```

### Minor

```bash
gh pr edit "$PR_NUMBER" \
  --remove-label "release:major,release:skip" \
  --add-label "release:minor"
```

### Major

```bash
gh pr edit "$PR_NUMBER" \
  --remove-label "release:minor,release:skip" \
  --add-label "release:major"
```

### Skip

```bash
gh pr edit "$PR_NUMBER" \
  --remove-label "release:minor,release:major" \
  --add-label "release:skip"
```

You can use a pull request URL or branch name instead of its number. When the
current branch already has a pull request, `gh pr edit` also works without an
argument.

## Verify the decision

List only the release labels currently applied to the pull request:

```bash
gh pr view "$PR_NUMBER" \
  --json labels \
  --jq '[.labels[].name | select(startswith("release:"))]'
```

Interpret the output as follows:

- `[]` means patch.
- `["release:minor"]` means minor.
- `["release:major"]` means major.
- `["release:skip"]` means no npm release.
- More than one value is a conflict; apply one of the commands above again.

## What automation does

The bump workflow runs when a pull request targeting `main` is opened,
updated, reopened, labeled, or unlabeled. It calculates the next version from
the version currently on `main`, updates `package.json`, promotes the
`Unreleased` CHANGELOG section, and commits the result to the pull request
branch.

Changing the label is safe. The workflow removes its previous bump before
recalculating, so switching from minor to major and back to minor does not bump
the version multiple times.

After the pull request is merged, the release workflow compares the version in
`package.json` with npm. An unpublished version is verified, published with
provenance, tagged as `v<version>`, and used to create a GitHub Release. An
already-published version is skipped successfully.

## Operational notes

- A pull request with `release:skip` does not receive a bump commit, and its
  `Bump version` job is expected to show as skipped.
- The bot cannot write a bump commit to a pull request branch in a fork. A
  maintainer must handle the version after merge or move the branch into this
  repository.
- A push made by the bump workflow's `GITHUB_TOKEN` does not run CI normally.
  To require a green check on the exact bot-authored bump commit, approve the
  parked **CI** run in the Actions tab. Do not approve the parked
  **Bump version** run.
- npm publishing requires the configured trusted publisher or an `NPM_TOKEN`
  repository secret.
