fs = require 'fs'

{print} = require 'sys'
{spawn} = require 'child_process'
pkg = require './package.json'

deploy = (callback) ->
	spawn 'cp', ['rjs.js', "deploy/rjs-#{pkg.version}.js"]

task 'deploy', 'Copy rjs.js to /deploy with latest version number', ->
  deploy()