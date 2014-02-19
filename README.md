A library of Javascript utility functions with an emphasis on Functional Programming.

# Installation

## Browser Land

Download the latest version of rjs.js from the repository, or get it with curl:

	curl https://raw.github.com/RaineOrShine/rjs/master/rjs.js > rjs.js	

Include it:

	<script type="text/javascript" src="rjs.js"></script>

## Node Land

From the command line:

	npm install rjs --save

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

The majority of the functions in RJS center around native types like String, Number, Array, and Function, making them perfect candidates for prototyping. Nothing is prototyped onto Object.

Instead of this:

	RJS.pluck(people, 'name')

Consider the following: 

	people.pluck('name')

Much better! It's more intuitive because it conforms to the subject-verb-object structure of the English language.

Adding RJS functions to native objects is off by default. To opt-in, call RJS.installPrototypes:

	RJS.installPrototypes();

# Unit Tests

	npm test

to open test/index.html in a browser.

# API

		// function
		I								: I,
		not 						: not,
		compose					: compose,
		sequence				: sequence,
		curryAt					: curryAt,
		curry						: curry,
		rcurry					: rcurry,
		arritize				: arritize,
		currify					: currify,
		callTillValue	 	: callTillValue,
		toInstance			: toInstance,
		install				 	: install,
		spy 						: spy,

		// string
		supplant				: supplant,
		startsWith			: startsWith,
		before					: before,
		after						: after,
		between					: between,
		bookend					: bookend,
		repeatString		: repeatString,
		toTitleCase		 	: toTitleCase,
		strContains			: strContains,

		// number
		ordinal				 	: ordinal,
		mapNumber			 	: mapNumber,

		// array
		pluck						: pluck,
		group						: group,
		orderedGroup		: orderedGroup,
		tally						: tally,
		contains				: contains,
		unique					: unique,
		reversed				: reversed,
		index						: index,
		rotate					: rotate,
		toObject				: toObject,
		find						: find,
		findByProperty	: findByProperty,
		spliced					: spliced,
		range						: range,
		filterBy				: filterBy,
		shuffle				: shuffle,
		chunk						: chunk,

		// object
		values					: values,
		keyValue				: keyValue,
		joinObj					: joinObj,
		isEmpty					: isEmpty,
		numProperties	 	: numProperties,
		merge					 	: merge,
		mapObject			 	: mapObject,
		toArray				 	: toArray,
		filterObject		: filterObject,
		changeKeys			: changeKeys,

		// utility
		compare					: compare,
		compareProperty	: compareProperty,
		dynamicCompare	: dynamicCompare,
		equals					: equals,
		hasKey					: hasKey,
		hasValue				: hasValue,
		hash						: hash,
		guid						: guid,
		typeOf					: typeOf,
		'new'						: createNew,

		// prototype installation
		installPrototypes : installPrototypes

