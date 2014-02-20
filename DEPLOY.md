# Deployment Steps
1. 	npm version {major/minor/patch}
2. 	cake deploy
3. 	git add -A
		git commit -m "Deploy vX.X.X"
		git push --tags
		npm publish