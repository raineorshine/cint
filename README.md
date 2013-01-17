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
	    "rjs":            "{VERSION}",
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
test/index.html

# API

## Function functions

	// Identity function.
	I(x)

	// Returns a function that returns the inverse of the given boolean function.
	not(f)

	// Returns true if the given function evaluates to true for any item in the given array. Returns false for [].
	any(arr, f)

	// Returns true if the given function evaluates to true for all items in the given array. Returns true for [].
	all(arr, f)

	/** Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments.
		i.e. A normal curry is equivalent to f.curryAt(0, args) and an rcurry is equivalent to f.curryAt(n, args) where n is the arrity of the function.
	*/
	curryAt(f, index, curriedArgs)

	// Returns a new function that always passes the given curried arguments to the inner function before normal arguments.
	curry(f, curriedArgs)

	// Returns a new function that always passes the given curried arguments to the inner function after normal arguments.
	rcurry(f, curriedArgs)

	// Returns a new function that calls the given function with a limit on the number of arguments.
	arritize(f, n)

	// Returns a new function that automatically curries its arguments if not saturated.
	currify(f, numArgs)

	// Recursively invokes the given function with no parameters until it returns a non-functional value.
	callTillValue(value)

	// Returns a new function that forwards 'this' as the first parameter to the given function, and thus can be called as instance method (or prototype method ) of the object itself. 
	toInstance(f, thisIndex)

	// Assigns the given list of methods from the host object to the protoObj's prototype after converting them with toInstance.
	install(protoObj, host, methods, thisIndex)

## String functions

	// Performs variable substitution on the string, replacing items in {curly braces}.
	supplant(str, o)

	// Removes whitespace from both ends of a string.
	trim(str)

	// Returns true if the string starts with the given substring.
	startsWith(str, sub)

	// Returns the substring before the first instance of the given delimiter.
	before(str, delim)

	// Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found.
	after(str, delim)

	// Returns the substring between the given delimiters.
	between(str, left, right)

	// Returns a single string that repeats the string n times.
	repeatString(str, n, delim)

	toTitleCase(str)

	strContains(str, look)

## Number functions

	// Returns the ordinal value (like "1st" or "2nd") of the given integer.
	ordinal(n)

	// Invokes the given function n times, passing the index for each invocation, and returns an array of the results.
	mapNumber(n, f)

## Array functions

	// Calls a function on each item in an array and returns a new array of the results.
	map(arr, f)

	each(arr, f)

	pluck(arr, property)

	// Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value.
	group(arr, propOrFunc)

	orderedGroup(arr, propOrFunc)

	// Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array.
	tally(arr)

	// Returns true if the array contains the given value (==).
	contains(arr, value)

	// Returns true if the array contains the given value (===).
	strictContains(arr, value)

	// Returns the unique values in the array.
	unique(arr)

	// Returns the reverse of the given array. Unlike the native reverse, does not modify the original array.
	reversed(arr)

	// Indexes into an array, supports negative indices.
	index(arr, i)

	// Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end.
	rotate(arr, n)

	// Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }.
	toObject(arr, f)

	// Returns the first item in the given array that returns true for the given function. If no item is found, returns false.
	find(arr, f)

	// Returns the first item in the given array whose specified property matches the given value.
	findByProperty(arr, prop, value)

	// Functional, nondestructive version of Array.prototype.splice.
	splice(arr, index, howMany/*, elements*/)

	// Returns an array of sequential integers from start to end. If only one parameter is specified, start is 1.
	range(start, end)

	// Returns a new array that only includes items for which f(item, i) is truthy.
	filter(arr, f)

	// Returns a new array that only includes items with a specific value of a given property.
	filterBy(arr, prop, value)

## Object functions

	// Returns an array of the object's keys (converted to strings).
	keys(o)

	// Returns an array of the object's values.
	values(o)

	// Returns a new object with the given key and value.
	keyValue(key, value)

	joinObj(obj, propSeparator, valueSeparator)

	// Returns true if the object has no non-undefined properties.
	isEmpty(o)

	// Returns the number of properties on the given object.
	numProperties(o)

	// Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments.
	merge(/*obj1, obj2, obj3, ...*/)

	// Returns a new object where f(key, value) returns a new key-value pair for each property.
	mapObject(obj, f)

	// Returns an array whose items are the result of calling f(key, value) on each property of the given object.
	toArray(obj, f)

	// Returns a new object that only includes the properties of the given obj for which f(key, value) is true.
	filterObject(obj, f)

	// Changes the specified keys in an object. 
	// @example { fname: "Raine", lname: "Lourie", specialty: "Javascript" }, 
	changeKeys(obj, changedKeys)

## Utility functions

	// Compares two items lexigraphically.  Returns 1 if a>b, 0 if a==b, or -1 if a<b.
	compare(a,b)

	// Returns a function that compares the given property of two items.
	compareProperty(property)

	// Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties.
	dynamicCompare(props)

	// Returns true if all the items in a are equal to all the items in b, recursively.
	equals(a,b)

	// Returns true if the given value is not undefined, null, or an empty string.
	hasValue(x)

	// Returns a string representation of the given scalar, array, or dictionary.
	hash(o)

	// Generates a pseudo-random string that can be assumed to be unique.
	guid()

	// Returns a string representing the type of the object, with special handling for null and arrays.
	typeOf(value)

	// Calls the given constructor and returns the new instance. Useful for higher order programmer where the new keyword won't work. 
	createNew(f)
