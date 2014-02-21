A Javascript utility belt with an emphasis on Functional Programming.

# Usage

Read the API (below) or check out some examples used in the [unit tests](https://github.com/metaraine/cinturon/blob/master/test/index.html).

# Installation

## Client-Side

Download the latest version of cinturon.js from the repository, or get it with curl:

	curl https://raw.github.com/metaraine/cinturon/master/dist/latest.js > cinturon.js

Include it:

	<script type="text/javascript" src="cinturon.js"></script>

## Server-Side

Install it:

	npm install cinturon --save

Require it:

	var cin = require("cinturon");

# Prototyping Onto Native Objects
While controversial, prototyping functions onto some native objects can result in especially elegant code.

The majority of the functions in cinturon center around native types like String, Number, Array, and Function, making them perfect candidates for prototyping. Nothing is prototyped onto Object.

Instead of this:

	cin.pluck(people, 'name')

Consider the following: 

	people.pluck('name')

Much better! It's more intuitive because it conforms to the subject-verb-object structure of the English language.

Adding cin functions to native objects is off by default. To opt-in, call cin.installPrototypes:

	cin.installPrototypes();

# Unit Tests

	npm test

to open test/index.html in a browser.

# API

## Function

	/** Identity function. */
	cin.I(x)

	/** Returns a function that returns the inverse of the given boolean function. */
	cin.not(f)

	/** Returns the composition of the given functions, e.g. f(g(h(i(...)))) */
	cin.compose(f[, rest])

	/** Returns a reverse composition of the given functions (i.e. executed in order) e.g. i(h(g(f(...)))) */
	cin.sequence([first, f])

	/** Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments.
		i.e. A normal curry is equivalent to f.curryAt(0, args) and an rcurry is equivalent to f.curryAt(n, args) where n is the arrity of the function.
	*/
	cin.curryAt(f, index, curriedArgs)

	/** Returns a new function that always passes the given curried arguments to the inner function before normal arguments. */
	cin.curry(f, args)

	/** Returns a new function that always passes the given curried arguments to the inner function after normal arguments. */
	cin.rcurry(f, args)

	/** Returns a new function that calls the given function with a limit on the number of arguments. */
	cin.arritize(f, n)

	/** Returns a new function that automatically curries its arguments if not saturated. */
	cin.currify(f, numArgs)

	/** Recursively invokes the given function with no parameters until it returns a non-functional value. */
	cin.callTillValue(value)

	/** Returns a new function that forwards 'this' as the first parameter to the given function, and thus can be called as instance method (or prototype method ) of the object itself. 
		@param thisIndex	Forwards 'this' at the given parameter index. Default: 0.
	*/
	cin.toInstance(f, thisIndex)

	/** Assigns the given list of methods from the host object to the protoObj's prototype after converting them with toInstance. */
	cin.install(protoObj, host, methods, safe)

	/** Calls the given function as normal, then passes its inputs and output to the spier (defaults to console.log) */
	cin.spy(f, spier)

## String

	/** Performs variable substitution on the string, replacing items in {curly braces}.
		Based on supplant by Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	cin.supplant(str, o)

	/** Returns true if the string starts with the given substring. */
	cin.startsWith(str, sub)

	/** Returns the substring before the first instance of the given delimiter. */
	cin.before(str, delim)

	/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. */
	cin.after(str, delim)

	/** Returns the substring between the given delimiters. */
	cin.betweenstr, left, right)

	/** Wraps a string with a left and right */
	cin.bookend(middle, left, right)

	/** Returns a single string that repeats the string n times. */
	cin.repeatString(str, n, delim)

	/** Capitalizes the first letter of each word in the given string. */
	cin.toTitleCase(str)

	/* Returns true if the string contains the given substring. */
	cin.strContains(str)

## Number

	/** Returns the ordinal value (like '1st' or '2nd') of the given integer. */
	cin.ordinal(n)

	/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. */
	cin.mapNumber(n, f)

## Array

	/** Returns a list of values plucked from the property from the given array. If the values are functions, they wll be bound to the array item. */
	cin.pluck(arr, property)

	/** Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value. */
	cin.group(arr, propOrFunc)

	/** Group the array of objects by one of the object's properties or mappable function. Returns an array of { key: ___, items: ___ } objects which represent all the items in the original array grouped by the value of the specified grouping key. */
	cin.orderedGroup(arr, propOrFunc)

	/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. */
	cin.tally(arr)

	/** Returns true if the array contains the given value. */
	cin.contains(arr)

	/** Returns the unique values in the array. */
	cin.unique(arr)

	/** Returns the reverse of the given array. Unlike the native reverse, does not modify the original array. */
	cin.reversed(arr

	/** Indexes into an array, supports negative indices. */
	cin.index(arr, i

	/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. */
	cin.rotate(arr, n)

	/** Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. */
	cin.toObject(arr, f)

	/** Returns the first item in the given array that returns true for the given function. If no item is found, returns null. */
	cin.find(arr, f

	/** Returns the first item in the given array whose specified property matches the given value. */
	cin.findByProperty(arr, prop, value)

	/** Functional, nondestructive version of Array.prototype.splice. */
	cin.spliced(arr, index, howMany/*, elements*/

	/** Returns an array of sequential integers from start to end (inclusive). If only one parameter is specified, start is 1. */
	cin.range(start, end)

	/** Returns a new array that only includes items with a specific value of a given property. */
	cin.filterBy(arr, prop, value

	/** Returns a new array with the array's items in random order. */
	cin.shuffle(arr)

	/** Breaks up the array into n evenly-sized chunks. 
		Solution from http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
	*/
	cin.chunk(a, n)

## Object

	/** Returns an array of the object's values. */
	cin.values(o)

	/** Returns a new object with the given key and value. */
	cin.keyValue(key, value)

	/** Join the object into a single string with the given separators separating properties from each other as well as values. */
	cin.joinObj(obj, propSeparator, valueSeparator)

	/** Returns true if the object has no non-undefined properties.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	cin.isEmpty(o)

	/** Returns the number of properties on the given object. */
	cin.numProperties(o)

	/** Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments. */
	cin.merge(/*obj1, obj2, obj3, ...*/)

	/** Returns a new object where f(key, value) returns a new key-value pair for each property. */
	cin.mapObject(obj, f)

	/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. If f is undefined, returns a list of { key: ___, value: ___ } objects. */
	cin.toArray(obj, f)

	/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. */
	cin.filterObject(obj, f)

	/** Changes the specified keys in an object. 
		@example cin.changeKeys(
			{ fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' }, 
			{ fname: 'first', lname: 'last' }
		)
	*/
	cin.changeKeys(obj, changedKeys)

## Utility

	/** Compares two items lexigraphically.	Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
	cin.compare(a,b)

	/** Returns a function that compares the given property of two items. */
	cin.compareProperty(property)

	/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties. A property can also be appended with ' ASC' or ' DESC' to control the sort order.
	*/
	cin.dynamicCompare(props)

	/** Returns true if all the items in a are equal to all the items in b, recursively. */
	cin.equals(a,b)

	/** in operator as a function. */
	cin.hasKey(creamFilling, donut)

	/** Returns true if the given value is not undefined, null, or an empty string. */
	cin.hasValue(x)

	/** Returns a string representation of the given scalar, array, or dictionary. */
	cin.hash(o)

	/** Generates a pseudo-random string that can be assumed to be unique.
		@remarks	untestable
	*/
	cin.guid()

	/** Returns a string representing the type of the object, with special handling for null and arrays.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	cin.typeOf(value)

	/** Create a new instance of the given constructor with the given constructor arguments. Useful for higher order programmer where the new keyword won't work. */
	cin.createNew(C, args)

## Prototype Installation

	/** Installs all cin methods onto their respective built-in prototypes: String, Number, Array, and Function. */
	cin.installPrototypes([cinturon])

