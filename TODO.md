# TODO
* add minification to build process
* function coercion on all higher order functions

	var toFunction = function(o) {
		var t = typeof o;
		return t === "function" ? o :
			t === "string" ? parseLambdaFunction(o) : // like Oliver Steele's .lambda()
			function() { return o; };
	};
* split into two libraries:
	- utility functions not included in underscore
	- installPrototypes
* remove proto tests and just have a single test of install
* switch to Chai testing
* Use Handlebars to insert version number into deployed rjs.js from Cakefile
	e.g. supplantFile(filename, { version: 'test' });
