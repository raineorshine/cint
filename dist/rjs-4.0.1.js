/** 
 * Raine's Javascript Extensions 
 * v4.0.1 (Fri, 21 Feb 2014 06:48:21 GMT)
 * A library of Javascript utility functions with an emphasis on Functional Programming.
 */

var RJS = (function() {
	'use strict';

	/***********************************
	 * Function
	 ***********************************/

	/** Identity function. */
	function I(x) { return x; }

	/** Returns a function that returns the inverse of the given boolean function. */
	function not(f) {
		return function() {
			return !f.apply(this, arguments);
		};
	}

	/** Returns the composition of the given functions, e.g. f(g(h(i(...)))) */
	function compose(f/*, rest*/) {
		var rest = Array.prototype.slice.call(arguments, 1);
		if(arguments.length === 1) {
			return f;
		}
		else {
			return function() {
				var r = compose.apply(this, rest);
				return f(r.apply(this, arguments));
			};
		}
	}

	/** Returns a reverse composition of the given functions (i.e. executed in order) e.g. i(h(g(f(...)))) */
	function sequence(/*first, f*/) {
		return compose.apply(this, reversed(arguments));
	}

	/** Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments.
		i.e. A normal curry is equivalent to f.curryAt(0, args) and an rcurry is equivalent to f.curryAt(n, args) where n is the arrity of the function.
	*/
	function curryAt(f, index, curriedArgs) {
		return function() {
			var givenArgs = Array.prototype.slice.call(arguments);

			// handle negative indices
			// Note that we add 1 so that -1 points to the slot AFTER the last element, not before the last element (which is what the last index points to).
			if(index < 0) {
				index = circ(givenArgs, index) + 1;
			}

			var spliceArgs = [givenArgs, index, 0].concat(curriedArgs);
			var newArgs = spliced.apply(this, spliceArgs);
			return f.apply(this, newArgs);
		};
	}

	/** Returns a new function that always passes the given curried arguments to the inner function before normal arguments. */
	var curry = curryAt(curryAt, 1, 0);

	/** Returns a new function that always passes the given curried arguments to the inner function after normal arguments. */
	var rcurry = curryAt(curryAt, 1, -1);

	/** Returns a new function that calls the given function with a limit on the number of arguments. */
	function arritize(f, n) {
		return function() {
			var givenArgs = Array.prototype.slice.call(arguments, 0, n);
			return f.apply(this, givenArgs);
		};
	}

	/** Returns a new function that automatically curries its arguments if not saturated. */
	function currify(f, numArgs) {

		if(numArgs === undefined) {
			numArgs = f.length;
		}

		return function() {
			var argsDiff = numArgs - arguments.length;
			var givenArgs = Array.prototype.slice.call(arguments, 0);
			return argsDiff <= 0 ?
				f.apply(this, arguments) :
				currify(curry(f, givenArgs), argsDiff);
		};
	}

	/** Recursively invokes the given function with no parameters until it returns a non-functional value. */
	function callTillValue(value) {
		return typeof value === 'function' ? callTillValue(value()) : value;
	}

	/** Returns a new function that forwards 'this' as the first parameter to the given function, and thus can be called as instance method (or prototype method ) of the object itself. 
		@param thisIndex	Forwards 'this' at the given parameter index. Default: 0.
	*/
	function toInstance(f, thisIndex) {
		thisIndex = thisIndex || 0;
		return function() {
			var args = Array.prototype.slice.apply(arguments);
			return f.apply(this, rotate([].concat([this], args), -thisIndex));
		};
	}

	/** Assigns the given list of methods from the host object to the protoObj's prototype after converting them with toInstance. */
	function install(protoObj, host, methods, safe) {

		if(safe === undefined) {
			safe = true;
		}

		var len = methods.length;
		for(var i=0; i<len; i++) {

			// the method can be a string if the hostKey and protoKey are the same ('contains') or an object that maps the host key to the proto key ({repeatString: 'repeat'})
			if(typeof methods[i] === 'string') {
				if(safe && !(methods[i] in protoObj.prototype)) {
					protoObj.prototype[methods[i]] = toInstance(host[methods[i]]);
				}
			}
			else {
				for(var name in methods[i]) {
					if(safe && !(methods[i][name] in protoObj.prototype)) {
						protoObj.prototype[methods[i][name]] = toInstance(host[name]);
					}
				}
			}
		}
	}

	/** Calls the given function as normal, then passes its inputs and output to the spier (defaults to console.log) */
	function spy(f, spier) {
		var that = this;
		/* jshint ignore:start */
		spier = spier || console.log.bind(console);
		/* jshint ignore:end */

		return function() {
			var args = Array.prototype.slice.call(arguments);
			var out = f.apply(that, args);
			spier.call(that, f, args, out);
			return out;
		};
	}


	/***********************************
	 * String
	 ***********************************/

	/** Performs variable substitution on the string, replacing items in {curly braces}.
		Based on supplant by Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	function supplant(str, o) {
		return str.replace(/{([^{}]*)}/g,
			function (a, b) {
				return b in o ? o[b] : a;
			}
		);
	}

	/** Returns true if the string starts with the given substring. */
	function startsWith(str, sub){
		return (str.indexOf(sub) === 0);
	}

	/** Returns the substring before the first instance of the given delimiter. */
	function before(str, delim) {
		return str.split(delim)[0];
	}

	/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. */
	function after(str, delim) {
		var delimIndex = str.indexOf(delim);
		return delimIndex >= 0 ?
			str.substring(delimIndex+delim.length) : str;
	}

	/** Returns the substring between the given delimiters. */
	function between(str, left, right) {
		return before(after(str, left), right);
	}

	/** Wraps a string with a left and right */
	function bookend(middle, left, right) {
		return (left || '') + middle + (right || left || '');
	}

	/** Returns a single string that repeats the string n times. */
	function repeatString(str, n, delim) {
		delim = delim || '';
		return mapNumber(n, function() { return str; }).join(delim);
	}

	/** Capitalizes the first letter of each word in the given string. */
	function toTitleCase(str) {
		var capitalizeFirst = function(s) {
			return s.length ? s[0].toUpperCase() + s.substring(1).toLowerCase() : '';
		};
		return str.split(' ').map(capitalizeFirst).join(' ');
	}

	/* Returns true if the string contains the given substring. */
	function strContains(str) {
		var args = Array.prototype.slice.call(arguments, 1);
		return String.prototype.indexOf.apply(str, args) !== -1;
	}

	/***********************************
	 * Number
	 ***********************************/
	/** Returns the ordinal value (like '1st' or '2nd') of the given integer. */
	function ordinal(n) {
		var lastDigit = n%10;
		return n + (
			n >= 11 && n <= 13 ? 'th' :
			lastDigit === 1 ? 'st' :
			lastDigit === 2 ? 'nd' :
			lastDigit === 3 ? 'rd' :
			'th');
	}

	/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. */
	function mapNumber(n, f) {
		var results = [];
		for(var i=0; i<n; i++) {
			results.push(f(i));
		}
		return results;
	}


	/***********************************
	 * Array
	 ***********************************/

	/** Returns a list of values plucked from the property from the given array. If the values are functions,
	they wll be bound to the array item. */
	function pluck(arr, property) {
		return arr.map(function(item) {
			var val = item[property];
			return typeof val === 'function' ? val.bind(item) : val;
		});
	}

	/** Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value. */
	function group(arr, propOrFunc) {

		if(propOrFunc === undefined) {
			throw new Error('You must specify a property name or mappable function.');
		}

		var getGroupKey = typeof propOrFunc === 'function' ?
			propOrFunc :
			function(item) { return item[propOrFunc]; };

		var dict = {};
		var len = arr.length;
		for(var i=0; i<len; i++) {
			var key = getGroupKey(arr[i]);
			if(!(key in dict)) {
				dict[key] = [];
			}
			dict[key].push(arr[i]);
		}

		return dict;
	}

	/** Group the array of objects by one of the object's properties or mappable function. Returns an array of { key: ___, items: ___ } objects which represent all the items in the original array grouped by the value of the specified grouping key. */
	function orderedGroup(arr, propOrFunc) {

		if(!propOrFunc) {
			throw new Error('You must specific a property name or mappable function.');
		}

		var getGroupKey = typeof propOrFunc === 'function' ?
			propOrFunc :
			function(item) { return item[propOrFunc]; };

		var results = [];
		var dict = {};
		var len = arr.length;
		for(var i=0; i<len; i++) {
			var key = getGroupKey(arr[i]);
			if(!(key in dict)) {
				dict[key] = [];
				results.push({key: key, items: dict[key]});
			}
			dict[key].push(arr[i]);
		}

		return results;
	}

	/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. */
	function tally(arr) {
		var dict = {};
		var len = arr.length;
		for(var i=0; i<len; i++) {
			var count = dict[arr[i]] || 0;
			dict[arr[i]] = count + 1;
		}
		return dict;
	}

	/** Returns true if the array contains the given value. */
	function contains(arr) {
		var args = Array.prototype.slice.call(arguments, 1);
		return Array.prototype.indexOf.apply(arr, args) !== -1;
	}

	/** Returns the unique values in the array. */
	function unique(arr) {
		var output = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(!contains(output, arr[i])) {
				output.push(arr[i]);
			}
		}
		return output;
	}

	/** Returns the reverse of the given array. Unlike the native reverse, does not modify the original array. */
	function reversed(arr) {
		var output = [];
		for(var i=arr.length-1; i>=0; i--) {
			output.push(arr[i]);
		}
		return output;
	}
	

	/** Returns the in-bounds index of the given index for the array, supports negative and out-of-bounds indices. 
		@private
	*/
	function circ(arr, i) {

		// return first index if i is null or undefined
		if(i === undefined || i === null) {
			return arr[0];
		}

		// one modulus to get in range, another to eliminate negative
		return (i % arr.length + arr.length) % arr.length;
	}

	/** Indexes into an array, supports negative indices. */
	function index(arr, i) {
		return arr[circ(arr, i)];
	}

	/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. */
	function rotate(arr, n) {
		var output = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			output.push(index(arr, i+n));
		}
		return output;
	}

	/** Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. */
	function toObject(arr, f) {
		var keyValues = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			keyValues.push(f(arr[i], i));
		}
		return merge.apply(arr, keyValues);
	}

	/** Returns the first item in the given array that returns true for the given function. If no item is found, returns null. */
	function find(arr, f) {
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(f(arr[i], i, arr)) {
				return arr[i];
			}
		}
		return null;
	}

	/** Returns the first item in the given array whose specified property matches the given value. */
	function findByProperty(arr, prop, value) {
		return find(arr, function(item) {
			return item[prop] === value;
		});
	}

	/** Functional, nondestructive version of Array.prototype.splice. */
	function spliced(arr, index, howMany/*, elements*/) {
		var elements = Array.prototype.slice.apply(arguments, [3]);
		var elementsLen = elements.length;
		var results = [];
		var len = arr.length;

		// add starting elements
		for(var i=0; i<index && i<len; i++) {
			results.push(arr[i]);
		}

		// add inserted elements
		for(i=0; i<elementsLen; i++) {
			results.push(elements[i]);
		}

		// add ending elements
		for(i=index+howMany; i<len; i++) {
			results.push(arr[i]);
		}

		return results;
	}

	/** Returns an array of sequential integers from start to end (inclusive). If only one parameter is specified, start is 1. */
	function range(start, end) {
		if(arguments.length === 1) {
			end = start;
			start = 1;
		}
		var results = [];
		for(var i=start; i<=end; i++) {
			results.push(i);
		}
		return results;
	}

	/** Returns a new array that only includes items with a specific value of a given property. */
	function filterBy(arr, prop, value) {
		return arr.filter(function(item) {
			return item[prop] === value;
		});
	}

	/** Returns a new array with the array's items in random order. */
	function shuffle(arr) {
		var output = arr.slice();
		function swap(i,j) {
			var temp = output[i];
			output[i] = output[j];
			output[j] = temp;
		}

		for(var i=0, len=output.length; i<len; i++) {
			var r = Math.floor(Math.random() * len);
			swap(i, r);
		}

		return output;
	}
	

	/** Breaks up the array into n evenly-sized chunks. 
			Solution from http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
	*/
	function chunk(a, n) {
		var len = a.length,out = [], i = 0;
		while (i < len) {
			var size = Math.ceil((len - i) / n--);
			out.push(a.slice(i, i += size));
		}
		return out;
	}


	/***********************************
	 * Object
	 ***********************************/

	/** Returns an array of the object's values. */
	function values(o) {
		var output = [];
		for(var key in o) {
			output.push(o[key]);
		}
		return output;
	}

	/** Returns a new object with the given key and value. */
	function keyValue(key, value) {
		var o = {};
		o[key] = value;
		return o;
	}

	/** Join the object into a single string with the given separators separating properties from each other as well as values. */
	function joinObj(obj, propSeparator, valueSeparator) {
		var keyValuePairs = [];
		for(var prop in obj) {
			keyValuePairs.push(prop + valueSeparator + obj[prop]);
		}
		return keyValuePairs.join(propSeparator);
	}

	/** Returns true if the object has no non-undefined properties.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	function isEmpty(o) {
		var i, v;
		if(typeOf(o) === 'object') {
			for (i in o) {
				v = o[i];
				if (v !== undefined && typeOf(v) !== 'function') {
					return false;
				}
			}
		}
		return true;
	}

	/** Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments. */
	function merge(/*obj1, obj2, obj3, ...*/) {

		var mothership = {};
		
		// iterate through each given object
		var len = arguments.length;
		for(var i=0; i<len; i++) {
			var outlier = arguments[i];
			
			// add each property to the mothership
			for(var prop in outlier) {
				if(typeOf(outlier[prop]) === 'object' && outlier[prop].constructor === Object && outlier[prop] !== null && !(outlier[prop] instanceof Array)) {
					mothership[prop] = merge(mothership[prop], outlier[prop]); // RECURSION
				}
				else if(outlier[prop] !== undefined) {
					mothership[prop] = outlier[prop];
				}
			}
		}
		
		return mothership;
	}

	/** Returns a new object where f(key, value) returns a new key-value pair for each property. */
	function mapObject(obj, f) {
		var result = {};
		for(var key in obj) {
			var pair = f(key, obj[key]);
			for(var prop in pair) {
				result[prop] = pair[prop];
			}
		}
		return result;
	}

	/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. If f is undefined, returns a list of { key: ___, value: ___ } objects. */
	function toArray(obj, f) {
		f = f || function(key, value) { return { key: key, value: value }; };
		var result = [];
		for(var key in obj) {
			result.push(f(key, obj[key]));
		}
		return result;
	}

	/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. */
	function filterObject(obj, f) {
		var result = {};
		for(var key in obj) {
			if(f(key, obj[key])) {
				result[key] = obj[key];
			}
		}
		return result;
	}

	/** Changes the specified keys in an object. 
		@example RJS.changeKeys(
			{ fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' }, 
			{ fname: 'first', lname: 'last' }
		)
	*/
	function changeKeys(obj, changedKeys) {
		var result = {};
		for(var key in obj) {
			result[key in changedKeys ? changedKeys[key] : key] = obj[key];
		}
		return result;
	}

	/***********************************
	 * Utility
	 ***********************************/

	/** Compares two items lexigraphically.	Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
	function compare(a,b) {
		return a > b ? 1 :
			a < b ? -1 :
			0;
	}

	/** Returns a function that compares the given property of two items. */
	function compareProperty(property) {
		return function(a,b) {
			return compare(a[property], b[property]);
		};
	}

	/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties.
	 * A property can also be appended with ' ASC' or ' DESC' to control the sort order.
	 * */
	function dynamicCompare(props) {

		if(!props || !(props instanceof Array)) {
			throw new Error('props is falsey or not an Array');
		}

		return function(a,b) {
			var len = props.length;
			for(var i=0; i<len; i++) {
				var aVal, bVal, sortDir;
				if(typeof props[i] == 'function') {
					aVal = props[i](a);
					bVal = props[i](b);
					sortDir = 'asc';
				}
			
				else if(props[i].toLowerCase().indexOf(' ') >= 0) {
					var splitVal = props[i].split(' ');
					aVal = a[splitVal[0]];
					bVal = b[splitVal[0]];
					sortDir = splitVal[1].toLowerCase();
				}
				else {
					aVal = a[props[i]];
					bVal = b[props[i]];
					sortDir = 'asc';
				}

				// this is important so that if the values are equial, it continues to the next sort property
				if(aVal != bVal) {
					return sortDir == 'asc' ? compare(aVal,bVal) : compare(bVal,aVal);
				}
			}
			return 0;
		};
	}

	/** Returns true if all the items in a are equal to all the items in b, recursively. */
	function equals(a,b) {

		if(typeof a !== typeof b) {
			return false;
		}

		// compare arrays
		if(a instanceof Array) {

			// check if the arrays are the same length
			if(a.length !== b.length) {
				return false;
			}

			// check the equality of each item
			for(var i=0, l=a.length; i<l; i++) {
				if(!b || !b[i] || !equals(a[i], b[i])) { // RECURSION
					return false;
				}
			}
		}
		// compare primitives
		else if(typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean' || typeof a === 'undefined') {
			if(a !== b) {
				return false;
			}
		}
		// compare objects
		else if(Object.keys(a).length === Object.keys(b)) {
			for(var property in a) {
				if(!(property in b && b[property] === a[property])) {
					return false;
				}
			}
		}
		else {
			return a === b;
		}

		return true;
	}

	/** in operator as a function. */
	function hasKey(creamFilling, donut) {
		return creamFilling in donut;
	}

	/** Returns true if the given value is not undefined, null, or an empty string. */
	function hasValue(x) {
		return x !== undefined && x !== null && x !== '';
	}

	/** Returns a string representation of the given scalar, array, or dictionary. */
	function hash(o) {
		if(o === undefined) {
			return 'undefined';
		}
		else if(o === null) {
			return 'null';
		}
		else if(typeof o === 'string' || typeof o === 'number') {
			return '' + o;
		}
		else if(typeOf(o) === 'array') {
			return '_[{0}]_'.format(o.map(hash).join(','));
		}
		else if(typeOf(o) === 'object') {
			var objString = '';
			for(var prop in o) {
				objString += supplant('{0}_:_{1}', [prop, hash(o[prop])]);
			}
			// escape for handlebars
			return supplant('_{{0}}_', [objString]); // jshint ignore:line
		}
		else {
			throw new Error('Unhashable value: ' + o);
		}
	}

	/** Generates a pseudo-random string that can be assumed to be unique.
		@remarks	untestable
	*/
	var guid = (function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return function() {
			return S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4();
		};
	})();

	/** Returns a string representing the type of the object, with special handling for null and arrays.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	function typeOf(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (typeof value.length === 'number' &&
						!(value.propertyIsEnumerable('length')) &&
						typeof value.splice === 'function') {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	}

	/** Create a new instance of the given constructor with the given constructor arguments. Useful for higher order programmer where the new keyword won't work. */
	function createNew(C, args) {
		var o = new C();
		C.apply(o, args);
		return o;
	}


	/***********************************
	 * Prototype Installation
	 ***********************************/

	/** Installs all RJS methods onto their respective built-in prototypes: String, Number, Array, and Function. */
	function installPrototypes(rjs) {
		rjs = rjs || RJS;
		install(String, rjs, ['supplant', 'startsWith', 'before', 'after', 'between', 'bookend', { repeatString: 'repeat' }, 'toTitleCase', { strContains: 'contains' }, 'index' ]);
		install(Number, rjs, ['ordinal', { mapNumber: 'map' }]);
		install(Array, rjs, ['each', 'pluck', 'group', 'orderedGroup', 'tally', 'contains', 'unique', 'reversed', 'index', 'rotate', 'toObject', 'find', 'findByProperty', 'filterBy', 'any', 'all', 'spliced', 'shuffle', 'chunk' ]);
		install(Function, rjs, ['any', 'all', 'compose', 'sequence', 'curryAt', 'curry', 'rcurry', 'arritize', 'currify', 'toInstance', 'new', 'spy']);
		return rjs;
	}


	/***********************************
	 * Export Public Interface
	 ***********************************/

	return {

		// function
		I								: I,
		not							: not,
		compose					: compose,
		sequence				: sequence,
		curryAt					: curryAt,
		curry						: curry,
		rcurry					: rcurry,
		arritize				: arritize,
		currify					: currify,
		callTillValue		: callTillValue,
		toInstance			: toInstance,
		install					: install,
		spy							: spy,

		// string
		supplant				: supplant,
		startsWith			: startsWith,
		before					: before,
		after						: after,
		between					: between,
		bookend					: bookend,
		repeatString		: repeatString,
		toTitleCase			: toTitleCase,
		strContains			: strContains,

		// number
		ordinal					: ordinal,
		mapNumber				: mapNumber,

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
		shuffle					: shuffle,
		chunk						: chunk,

		// object
		values					: values,
		keyValue				: keyValue,
		joinObj					: joinObj,
		isEmpty					: isEmpty,
		merged					: merge,
		mapObject				: mapObject,
		toArray					: toArray,
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
	};

})();

// nodejs module
if(typeof module !== 'undefined') {
	module.exports = RJS;
}
