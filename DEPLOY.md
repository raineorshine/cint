# Deployment Instructions

## General
Add tests
npm test
Update README
Add and commit all changes
Update HISTORY
gulp

## stable
npm version minor
Bump version number in bower.json
git push
git push --tags
npm publish

## unstable
Bump version number in package.json
Bump version number in bower.json
git add -A
git commit -m "vX.X.X-alpha.1"
git tag vX.X.X-alpha.1
git push
git push --tags
npm publish --tag unstable