---
name: make-release
description: Bump the package version, commit, tag the release and push it to origin.
argument-hint: <version_number>
disable-model-invocation: true
allowed-tools: Bash(git *), Bash(npm *), Bash(node *)
---

Make a release of regjsparser for version `$ARGUMENTS`.

Strip a leading `v` from the argument if present; call the result VERSION (e.g. `0.13.4`). If no argument was given, or VERSION is not a valid semver version, stop and ask for one.

## Preconditions

Check all of these and stop with an explanation if any fails:

1. The current branch is `gh-pages`.
2. The working tree is clean (`git status --porcelain` is empty).
3. `git fetch origin` succeeds and local `gh-pages` is not behind or diverged from `origin/gh-pages`.
4. The tag `vVERSION` does not already exist locally or on origin (`git ls-remote --tags origin vVERSION`).
5. VERSION is greater than the current `version` in `package.json`.
6. `npm test` passes.

## Release

1. Update the version in `package.json` and `package-lock.json` without creating a commit or tag:
   `npm version VERSION --no-git-tag-version`
2. Confirm that `git diff --stat` shows only `package.json` and `package-lock.json`, with just the version fields changed.
3. Commit those two files with the message `Bump version vVERSION` (plus the usual co-author trailer).
4. Create an annotated tag on that commit:
   `git tag -a vVERSION -m "Release of vVERSION."`
5. Push the commit and the tag:
   `git push origin gh-pages && git push origin vVERSION`

Report the commit hash, the tag and the push results. Publishing to npm is not part of this command; mention that `npm publish` is still a separate step.
