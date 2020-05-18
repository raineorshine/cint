# Deployment Instructions

## General
Add tests
npm test
Update README
Add and commit all changes
Update HISTORY

## stable
npm version minor
gulp
git commit --amend
git push
git push --tags
npm publish

## unstable
Bump version number in package.json
gulp
git add -A
git commit -m "vX.X.X-alpha.1"
git tag vX.X.X-alpha.1
git push
git push --tags
npm publish --tag unstable