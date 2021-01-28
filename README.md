A Javascript utility belt with an emphasis on Functional Programming.

- No *direct* overlap with lodash
- No dependencies

[![npm version](https://img.shields.io/npm/v/cint.svg)](https://npmjs.org/package/cint)
[![Build Status](https://img.shields.io/github/workflow/status/raineorshine/cint/Tests/master?label=tests&logo=github)](https://github.com/raineorshine/cint/actions?query=workflow%3ATests+branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/github/raineorshine/cint/badge.svg?branch=master)](https://coveralls.io/github/raineorshine/cint?branch=master)

# Installation

```sh
npm install cint --save
```

# Usage

```js
import cint from 'cint'
```

# API

## Function

```js
/** Returns a function that returns the inverse of the given boolean function. */
not(f)

/** Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments.
  i.e. _.partial(f, args...) is equivalent to partialAt(f, 0, args) and _.partialRight(f, args...) is equivalent to partialAt(f, n, args) where n is the arity of the function.
*/
partialAt(f, index, curriedArgs)

/** Returns a new function that calls the given function with a limit on the number of arguments. */
aritize(f, n)

/** Recursively invokes the given function with no parameters until it returns a non-functional value. */
callTillValue(value)

/** Calls the given function as normal, then passes its inputs and output to the spier (defaults to console.log) */
spy(f, spier)

/** Converts the given synchronous function into an asynchronous function that applies its arguments to the original function and invokes callback(error, result) */
toAsync(f)
```

## String

```js
/** Performs variable substitution on the string, replacing items in {curly braces}.
  Based on supplant by Douglas Crockford http://javascript.crockford.com/remedial.html
*/
supplant(str, o)

/** Returns true if the string starts with the given substring. */
startsWith(str, sub)

/** Returns the substring before the first instance of the given delimiter. */
before(str, delim)

/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. */
after(str, delim)

/** Returns the substring between the given delimiters. */
betweenstr, left, right)

/** Wraps a string with a left and right */
bookend(middle, left, right)

/** Returns a single string that repeats the string n times. */
repeatString(str, n, delim)

/** Capitalizes the first letter of each word in the given string. */
toTitleCase(str)
```

## Number

```js
/** Returns the ordinal value (like '1st' or '2nd') of the given integer. */
ordinal(n)

/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. */
mapNumber(n, f)
```

## Array

```js
/** Returns a list of values plucked from the property from the given array. If the values are functions, they wll be bound to the array item. */
pluck(arr, property)

/** Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value. */
group(arr, propOrFunc)

/** Group the array of objects by one of the object's properties or mappable function. Returns an array of { key: ___, items: ___ } objects which represent all the items in the original array grouped by the value of the specified grouping key. */
orderedGroup(arr, propOrFunc)

/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. */
tally(arr)

/** Tally the property values of an array of object, grouping the counts for each property under its value.
e.g.
[
  {
    ideal: 4,
    past: 3,
    present: 7
  },
  {
    ideal: 5,
    past: 7,
    present: 7
  }
]

=>

{
  "4": {
    ideal: 1
  },
  "3": {
    past: 1
  }
  "5": {
    ideal: 1
  }
  "7": {
    present: 2,
    past: 1
  }
}
*/
tallyProps(arr)

/** Returns the unique values in the array. */
unique(arr)

/** Returns the reverse of the given array. Unlike the native reverse, does not modify the original array. */
reversed(arr)

/** Indexes into an array, supports negative indices. */
index(arr, i)

/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. */
rotate(arr, n)

/** Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. */
toObject(arr, f)

/** Returns the first item in the given array that returns true for the given function. If no item is found, returns null. */
find(arr, f)

/** Returns the first item in the given array whose specified property matches the given value. */
findByProperty(arr, prop, value)

/** Functional, nondestructive version of Array.prototype.splice. */
spliced(arr, index, howMany/*, elements*/

/** Returns an array of sequential integers from start to end (inclusive). If only one parameter is specified, start is 1. */
range(start, end)

/** Returns a new array that only includes items with a specific value of a given property. */
filterBy(arr, prop, value)

/** Breaks up the array into n evenly-sized chunks.
  Solution from http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
*/
chunk(a, n)
```

## Object

```js
/** Returns an array of the object's values. */
values(o)

/** Returns a new object with the given key and value. */
keyValue(key, value)

/** Gets the value of a key of the given object. */
getValue(o, key)

/** Sets the value of the given key and returns the object. */
setValue(o, key, value)

/** Creates a mapping function that applies the given function to the value of the specified key. */
mapOverKey(f, originalKey, newKey)

/** Join the object into a single string with the given separators separating properties from each other as well as values. */
joinObject(obj, propSeparator, valueSeparator)

/** Returns true if the object has no non-undefined properties.
  @author Douglas Crockford http://javascript.crockford.com/remedial.html
*/
isEmpty(o)

/** Returns the number of properties on the given object. */
numProperties(o)

/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. If f is undefined, returns a list of { key: ___, value: ___ } objects. */
toArray(obj, f)

/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. */
filterObject(obj, f)

/** Changes the specified keys in an object.
  @example changeKeys(
    { fname: 'Raine', lname: 'Revere', specialty: 'Javascript' },
    { fname: 'first', lname: 'last' }
  )
*/
changeKeys(obj, changedKeys)

/** Calls a function on an object and returns the object (for chaining purposes). */
tap(f, o)

/* console.log's the given object and returns the object (for chaining purposes). */
look(o)
```

## Utility

```js
/** Adds two numbers. */
addTwo(x, y)

/** Adds all given arguments. */
add(/*x,y,z,...*/)

/** Compares two items lexigraphically. Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
compare(a,b)

/** Returns a function that compares the given property of two items. */
compareProperty(property)

/** Create a new instance of the given constructor with the given constructor arguments. Useful for higher order programmer where the new keyword won't work. */
createNew(C, args)

/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties. A property can also be appended with ' ASC' or ' DESC' to control the sort order.
*/
dynamicCompare(props)

/** Returns true if all the items in a are equal to all the items in b, recursively. */
equals(a,b)

/** in operator as a function. */
hasKey(creamFilling, donut)

/** Returns true if the given value is not undefined, null, or an empty string. */
hasValue(x)

/** Returns a string representation of the given scalar, array, or dictionary. */
hash(o)

/** Converts the given value to a string by calling its toString method. */
intoString(value)

/** Generates a pseudo-random string that can be assumed to be unique.
  @remarks  untestable
*/
guid()

/** Returns a string representing the type of the object, with special handling for null and arrays.
  @author Douglas Crockford http://javascript.crockford.com/remedial.html
*/
typeOf(value)
```
