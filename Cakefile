fs =         require 'fs'
{print} =    require 'sys'
{spawn} =    require 'child_process'
pkg =        require './package.json'
handlebars = require 'handlebars'

source = fs.readFileSync('src/rjs.js').toString()

deploy = (options) ->
	console.log options
	compiled = handlebars.compile(source)(
		version: pkg.version 
		date:    (new Date()).toUTCString()
	)
	fs.writeFileSync("deploy/TESTrjs-#{pkg.version}.js", compiled)
	fs.writeFileSync("rjs.js", compiled)

task 'public', 'Bump the version by major|minor|patch and push to github.', (options)->
	if not options.versionType
		console.error 'You must specify -v major|minor|patch'
		return

	spawn 'cp', ['rjs.js', "deploy/rjs-#{pkg.version}.js"]
	spawn 'npm', ['version', options.versionType]
	spawn 'git', ['add', '-A']
	spawn 'git', ['commit', '-m', '"Deploy vX.X.X"']
	spawn 'git', ['push', '--tags'] 
	spawn 'npm', ['publish']

option '-v', '--versionType [DIR]', 'TEST'
task 'deploy', 'Copy src/rjs.js to / with latest version number', deploy
