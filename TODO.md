* function coercion on all higher order functions

	var toFunction = function(o) {
		var t = typeof o;
		return t === "function" ? o :
			t === "string" ? parseLambdaFunction(o) : // like Oliver Steele's .lambda()
			function() { return o; };
	};

* currify everything!
* dynamically insert version number into cake file
* add minified version
* split into two libraries:
	- utility functions not included in underscore
	- installPrototypes
