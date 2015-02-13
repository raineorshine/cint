# Deployment Steps
Add tests
npm test
Update README
Add and commit all changes
Bump version number in package.json
Bump version number in bower.json
Update HISTORY
gulp
git add -A
git commit -m "vX.X.X"
git tag vX.X.X
git push && git push --tags
npm publish