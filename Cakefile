fs =         require 'fs'
{print} =    require 'sys'
{spawn} =    require 'child_process'
pkg =        require './package.json'
handlebars = require 'handlebars'

source = fs.readFileSync('src/rjs.js').toString()
template = handlebars.compile(source)

deploy = ->
	compiled = template
		version: pkg.version 
		date:    (new Date()).toUTCString()
	fs.writeFileSync("dist/rjs-#{pkg.version}.js", compiled)
	fs.writeFileSync("dist/latest.js", compiled)

###
task 'publish', 'Add, commit (with message Deploy vX.X.X), push, and publish on npm.', (options)->
	invoke 'deploy'
	spawn 'git', ['add', '-A']
	spawn 'git', ['commit', '-m', '"Deploy v#{pkg.version}"']
	spawn 'git', ['push', '--tags'] 
	spawn 'npm', ['publish']
###

task 'deploy', 'Copy /src/rjs.js to /dist with version number from package.json.', deploy
