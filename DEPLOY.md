# Deployment Steps
npm version {major/minor/patch}
cake deploy
subl deploy/rjs-X.X.X.js (edit version number in deployed file... until Handlebars substitution is built)
git add -A
git commit -m "Deploy vX.X.X"
git push --tags
npm publish