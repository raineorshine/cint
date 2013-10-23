A library of Javascript utility functions with an emphasis on Functional Programming.

# Installation

## Browser Land

Download rjs.js from the repository, or get it with curl:

	curl https://raw.github.com/RaineOrShine/rjs/master/rjs.js > rjs.js	

Include it:

	<script type="text/javascript" src="rjs.js"></script>

## Node Land

From the command line:

	npm install rjs

Or add it as a dependency:

	npm view rjs version	# find out the latest published version

	# add to package.json
	"dependencies": {
	    "rjs":            "~{VERSION}",
	    ...

	npm update

Require it:

	RJS = require("rjs");

# Prototyping Onto Native Objects
While controversial, prototyping functions onto some native objects can result in especially elegant code.

The majority of the functions in RJS center around native types like String, Number, Array, and Function, making them 
perfect candidates for prototyping. Nothing is prototyped onto Object.

Instead of this:

	RJS.map(people, function(person) {
		return RJS.supplant("Hello {0}!", [person.name]);
	});

Consider the following: 

	people.map(function(person) {
		return "Hello {0}!".supplant([person.name]);
	});

Beautiful! It's more intuitive because it conforms to the subject-verb-object structure of the English language.

Adding RJS functions to native objects is off by default. To opt-in, call RJS.installPrototypes:

	RJS.installPrototypes();

Require and install prototypes in one line:

	RJS = require(".rjs").installPrototypes();

# Unit Tests

	npm test

or open test/index.html in a browser.

