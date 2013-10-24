# Deployment Steps
npm version {major/minor/patch}
cake deploy
edit version number in deployed file (until Handlebars substitution is built)
git push --tags
npm publish