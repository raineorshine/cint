/** A Javascript utility belt with an emphasis on Functional Programming.
	@module cint
	@author Raine Lourie
	@version v6.0.0 (Fri, 18 Apr 2014 00:13:01 GMT)
*/
cint = (function() {
	'use strict';

	/***********************************
	 * Function
	 ***********************************/

	/** Returns a function that returns the inverse of the given boolean function.
		@memberOf module:cint#
		@param {function} f The function to inverse.
	*/
	function not(f) {
		return function() {
			return !f.apply(this, arguments);
		};
	}

	/** Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments.
		@memberOf module:cint#
		@example _.partial(f, args...) is equivalent to cint.partialAt(f, 0, args) and _.partialRight(f, args...) is equivalent to cint.partialAt(f, n, args) where n is the arrity of the function.
		@param {Function} f
		@param {Number} index
		@param {...*} curriedArgs
	*/
	function partialAt(f, index, curriedArgs) {
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

	/** Returns a new function that calls the given function with a limit on the number of arguments. 
		@memberOf module:cint#
		@param {Function} f
		@param {Number} n
	*/
	function arritize(f, n) {
		return function() {
			var givenArgs = Array.prototype.slice.call(arguments, 0, n);
			return f.apply(this, givenArgs);
		};
	}

	/** Recursively invokes the given function with no parameters until it returns a non-functional value. 
		@memberOf module:cint#
		@param value
	*/
	function callTillValue(value) {
		return typeof value === 'function' ? callTillValue(value()) : value;
	}

	/** Calls the given function as normal, then passes its inputs and output to the spier (defaults to console.log) 
		@memberOf module:cint#
		@param {Function} f
		@param {Function} [spier=console.log]
	*/
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
		Same as Lodash's _.template(str, o, { interpolate: /{([\s\S]+?)}/g }).
		Based on supplant by Douglas Crockford http://javascript.crockford.com/remedial.html
		@param {String} str
		@param {Object|Array} o
	*/
	function supplant(str, o) {
		return str.replace(/{([^{}]*)}/g,
			function (a, b) {
				return b in o ? o[b] : a;
			}
		);
	}

	/** Returns true if the string starts with the given substring. 
		@memberOf module:cint#
		@param {String} str
		@param {String} sub The substring.
	*/
	function startsWith(str, sub){
		return (str.indexOf(sub) === 0);
	}

	/** Returns the substring before the first instance of the given delimiter. 
		@memberOf module:cint#
		@param {String} str
		@param {String} delim
	*/
	function before(str, delim) {
		return str.split(delim)[0];
	}

	/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. 
		@memberOf module:cint#
		@param {String} str
		@param {String} delim
	*/
	function after(str, delim) {
		var delimIndex = str.indexOf(delim);
		return delimIndex >= 0 ?
			str.substring(delimIndex+delim.length) : str;
	}

	/** Returns the substring between the given delimiters. 
		@memberOf module:cint#
		@param {String} str
		@param {String} left
		@param {String} right
	*/
	function between(str, left, right) {
		return before(after(str, left), right);
	}

	/** Wraps a string with a left and right. If right omitted, wraps both ends in left. 
		@memberOf module:cint#
		@param {string} middle
		@param {string} left
		@param {string} right
	*/
	function bookend(middle, left, right) {
		return (left || '') + middle + (right || left || '');
	}

	/** Returns a single string that repeats the string n times. Optionally joins it with the given delimeter 
		@memberOf module:cint#
		@param {String} str
		@param {Number} n
		@param {String} delim Default: ''
	*/
	function repeatString(str, n, delim) {
		delim = delim || '';
		return mapNumber(n, function() { return str; }).join(delim);
	}

	/** Capitalizes the first letter of each word in the given string. 
		@memberOf module:cint#
		@param {String} str
	*/
	function toTitleCase(str) {
		var capitalizeFirst = function(s) {
			return s.length ? s[0].toUpperCase() + s.substring(1).toLowerCase() : '';
		};
		return str.split(' ').map(capitalizeFirst).join(' ');
	}


	/***********************************
	 * Number
	 ***********************************/

	/** Returns the ordinal value (like '1st' or '2nd') of the given integer. 
		@memberOf module:cint#
		@param {Number} n
	*/
	function ordinal(n) {
		var lastDigit = n%10;
		return n + (
			n >= 11 && n <= 13 ? 'th' :
			lastDigit === 1 ? 'st' :
			lastDigit === 2 ? 'nd' :
			lastDigit === 3 ? 'rd' :
			'th');
	}

	/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. 
		@memberOf module:cint#
		@param {Number} n
		@param {Function} f
	*/
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

	/** Group the array of objects by one of the object's properties or mappable function. Returns an array of { key: ___, items: ___ } objects which represent all the items in the original array grouped by the value of the specified grouping key. 
		@memberOf module:cint#
		@param {Object[]} arr
		@param {String|Function} propOrFunc
	*/
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

	/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. 
		@memberOf module:cint#
		@param {Array} arr
	*/
	function tally(arr) {
		var dict = {};
		var len = arr.length;
		for(var i=0; i<len; i++) {
			var count = dict[arr[i]] || 0;
			dict[arr[i]] = count + 1;
		}
		return dict;
	}


	/** Returns the in-bounds index of the given index for the array, supports negative and out-of-bounds indices. 
		@private
		@param {Array} arr
		@param {Number} i
	*/
	function circ(arr, i) {

		// return first index if i is null or undefined
		if(i === undefined || i === null) {
			return arr[0];
		}

		// one modulus to get in range, another to eliminate negative
		return (i % arr.length + arr.length) % arr.length;
	}

	/** Indexes into an array, supports negative indices. 
		@memberOf module:cint#
		@param {Array} arr
		@param {Number} n
	*/
	function index(arr, i) {
		return arr[circ(arr, i)];
	}

	/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. 
		@memberOf module:cint#
		@param {Array} arr
		@param {Number} n
	*/
	function rotate(arr, n) {
		var output = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			output.push(index(arr, i+n));
		}
		return output;
	}

	/** Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. 
		@memberOf module:cint#
		@param {Array} arr
		@param {Function} f
	*/
	function toObject(arr, f) {
		var keyValues = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			keyValues.push(f(arr[i], i));
		}
		return merge.apply(arr, keyValues);
	}

	/** Functional, nondestructive version of Array.prototype.splice. 
		@memberOf module:cint#
		@param {Array} arr
		@param {Number} index
		@param {Number} howMany
		@param {...*} elements
	*/
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

	/** Breaks up the array into n evenly-sized chunks. 
			Solution from http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
			@memberOf module:cint#
			@param {Array} arr
			@param {Number} n
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

	/** Returns a new object with the given key and value. 
		@memberOf module:cint#
		@param {String} key
		@param value
	*/
	function keyValue(key, value) {
		var o = {};
		o[key] = value;
		return o;
	}

	/** Join the object into a single string with the given separators separating properties from each other as well as values. 
		@memberOf module:cint#
		@param {Object} obj
		@param {String} propSeparator
		@param {String} valueSeparator
	*/
	function joinObj(obj, propSeparator, valueSeparator) {
		var keyValuePairs = [];
		for(var prop in obj) {
			keyValuePairs.push(prop + valueSeparator + obj[prop]);
		}
		return keyValuePairs.join(propSeparator);
	}

	/** Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments. 
		@memberOf module:cint#
		@param {...Object} objects
	*/
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

	/** Returns a new object where f(key, value) returns a new key-value pair for each property. 
		@memberOf module:cint#
		@param {Object} obj
		@param {Function} f
	*/
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

	/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. If f is undefined, returns a list of { key: ___, value: ___ } objects. 
		@memberOf module:cint#
		@param {Object} obj
		@param {Function} f
	*/
	function toArray(obj, f) {
		f = f || function(key, value) { return { key: key, value: value }; };
		var result = [];
		for(var key in obj) {
			result.push(f(key, obj[key]));
		}
		return result;
	}

	/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. 
		@memberOf module:cint#
		@param {Object} obj
		@param {Function} f
	*/
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
		@param {Object} obj
		@param {Object} changeKeys
		@example cint.changeKeys(
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

	/** Compares two items lexigraphically.	Returns 1 if a>b, 0 if a==b, or -1 if a<b. 
		@memberOf module:cint#
		@param a
		@param b
	*/
	function compare(a,b) {
		return a > b ? 1 :
			a < b ? -1 :
			0;
	}

	/** Returns a function that compares the given property of two items. 
		@memberOf module:cint#
		@param {String} property
	*/
	function compareProperty(property) {
		return function(a,b) {
			return compare(a[property], b[property]);
		};
	}

	/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties. A property can also be appended with ' ASC' or ' DESC' to control the sort order.
		@memberOf module:cint#
		@param {String[]|Object[]} props
  */
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

	/** Returns true if all the items in a are equal to all the items in b, recursively. 
		@memberOf module:cint#
		@param a
		@param b
	*/
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

	/** Returns true if the given value is not undefined, null, or an empty string. 
		@memberOf module:cint#
		@param x
	*/
	function isValue(x) {
		return x !== undefined && x !== null && x !== '';
	}

	/** Returns a string representation of the given scalar, array, or dictionary. 
		@memberOf module:cint#
		@param o
	*/
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
			return supplant('_\{{0}}_', [objString]); // jshint ignore:line
		}
		else {
			throw new Error('Unhashable value: ' + o);
		}
	}

	/** Generates a pseudo-random string that can be assumed to be unique. */
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
		@param value
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

	/** Create a new instance of the given constructor with the given constructor arguments. Useful for higher order programmer where the new keyword won't work. 
		@memberOf module:cint#
		@param {Function} C Constructor
		@param {Array} args
	*/
	function createNew(C, args) {
		var o = new C();
		C.apply(o, args);
		return o;
	}


	/***********************************
	 * Export Public Interface
	 ***********************************/

	return {

		// function
		not							: not,
		partialAt				: partialAt,
		arritize				: arritize,
		callTillValue		: callTillValue,
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

		// number
		ordinal					: ordinal,
		mapNumber				: mapNumber,

		// array
		orderedGroup		: orderedGroup,
		tally						: tally,
		index						: index,
		rotate					: rotate,
		toObject				: toObject,
		spliced					: spliced,
		chunk						: chunk,

		// object
		keyValue				: keyValue,
		joinObj					: joinObj,
		mapObject				: mapObject,
		toArray					: toArray,
		filterObject		: filterObject,
		changeKeys			: changeKeys,

		// utility
		compare					: compare,
		compareProperty	: compareProperty,
		dynamicCompare	: dynamicCompare,
		equals					: equals,
		isValue					: isValue,
		hash						: hash,
		guid						: guid,
		typeOf					: typeOf,
		'new'						: createNew,
	};

})();

// requirejs export
if(typeof module !== 'undefined') {
	module.exports = cint;
}
