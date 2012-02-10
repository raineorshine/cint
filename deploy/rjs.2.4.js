/** 
 * Raine's Javascript Extensions 
 * A library of basic Javascript functions that nobody should be without.
 */

var RJS = (function() {

	// PRIVATE FUNCTIONS
	var _curry = function(/*fn, args...*/) {
		var fn = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};


	/***********************************
	 * String
	 ***********************************/

	/** Performs variable substitution on the string, replacing items in {curly braces}.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	var supplant = function(str, o) {

		if(arguments.length > 2) {
			o = [].slice.apply(arguments, [1]);
		}

		return str.replace(/{([^{}]*)}/g,
			function (a, b) {
				return b in o ? o[b] : a;
			}
		);
	};

	/** Removes whitespace from both ends of a string.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	var trim = function(str) {
		return str.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
	};

	/** Returns true if the string starts with the given substring. */
	var startsWith = function(str, sub){
		return (str.indexOf(sub) === 0);
	};

	/** Returns the substring before the first instance of the given delimiter. */
	var before = function(str, delim) { 
		return str.split(delim)[0]; 
	};

	/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. */
	var after = function(str, delim) {
		var delimIndex = str.indexOf(delim);
		return delimIndex >= 0 ?
			str.substring(delimIndex+delim.length) : str;
	};

	/** Returns the substring between the given delimiters. */
	var between = function(str, left, right) { 
		return before(after(str, left), right); 
	};

	/** Returns a single string that repeats the string n times. */
	var repeatString = function(str, n, delim) {
		delim = delim || "";
		return mapNumber(n, function(i) { return str; }).join(delim);
	};

	var toTitleCase = function(str) {
		var capitalizeFirst = function(s) { return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase(); };
		return map(str.split(" "), capitalizeFirst).join(" ");
	};

	/***********************************
	 * Number
	 ***********************************/
	/** Returns the ordinal value (like "1st" or "2nd") of the given integer. */
	var ordinal = function(n) {
		var lastDigit = n%10;
		return n + (
			n >= 11 && n <= 13 ? "th" :
			lastDigit === 1 ? "st" :
			lastDigit === 2 ? "nd" :
			lastDigit === 3 ? "rd" : 
			"th");
	};

	/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. */
	var mapNumber = function(n, f) {
		var results = [];
		for(var i=0; i<n; i++) {
			results.push(f(i));
		}
		return results;
	};


	/***********************************
	 * Array
	 ***********************************/

	/** Calls a function on each item in an array and returns a new array of the results. */
	var map = function(arr, f) {
		var results = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			results.push(f(arr[i], i));
		}
		return results;
	};

	var pluck = function(arr, property) {
		return map(arr, function(item) {
			return item[property];
		});
	};

	/** Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value. */
	var group = function(arr, propOrFunc) {

		if(propOrFunc === undefined) {
			throw new Error("You must specify a property name or mappable function.");
		}

		var getGroupKey = typeof(propOrFunc) == "function" ? 
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
		};

		return dict;
	};

	var orderedGroup = function(arr, propOrFunc) {

		if(!propOrFunc) {
			throw new Error("You must specific a property name or mappable function.");
		}

		var getGroupKey = typeof(propOrFunc) == "function" ? 
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
		};

		return results;
	};

	/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. */
	var tally = function(arr) {
		var dict = {};
		var len = arr.length;
		for(var i=0; i<len; i++) {
			var count = dict[arr[i]] || 0;
			dict[arr[i]] = count + 1;
		};
		return dict;
	};

	/** Returns true if the array contains the given value (==). */
	var contains = function(arr, value) {
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(arr[i] == value) {
				return true;
			}
		}
		return false;
	};

	/** Returns true if the array contains the given value (===). */
	var strictContains = function(arr, value) {
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(arr[i] === value) {
				return true;
			}
		}
		return false;
	};

	/** Returns the unique values in the array. */
	var unique = function(arr) {
		var output = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(!strictContains(output, arr[i])) {
				output.push(arr[i]);
			}
		}
		return output;
	};

	/** Returns the reverse of the given array. Unlike the native reverse, does not modify the original array. */
	var reversed = function(arr) {
		var output = [];
		for(var i=arr.length-1; i>=0; i--) {
			output.push(arr[i]);
		}
		return output;
	}

	/** Indexes into an array, supports negative indices. */
	var index = function(arr, i) {
		// one modulus to get in range, another to eliminate negative
		return arr[(i % arr.length + arr.length) % arr.length];
	};

	/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. */
	var rotate = function(arr, n) {
		var output = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			output.push(index(arr, i+n));
		}
		return output;
	};

	/* Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. */
	var toObject = function(arr, f) {
		var keyValues = [];
		var len = arr.length;
		for(var i=0; i<len; i++) {
			keyValues.push(f(arr[i], i));
		}
		return merge.apply(arr, keyValues);
	};

	/** Returns the first item in the given array that returns true for the given function. If no item is found, returns false. */
	var find = function(arr, f) {
		var len = arr.length;
		for(var i=0; i<len; i++) {
			if(f(arr[i], i)) {
				return arr[i];
			}
		}
		return null;
	};

	/** Returns the first item in the given array whose specified property matches the given value. */
	var findByProperty = function(arr, prop, value) {
		return find(arr, function(item) {
			return item[prop] === value;
		});
	};

	/***********************************
	 * Utility
	 ***********************************/

	/** Returns an array of the object's keys (converted to strings). */
	var keys = function(o) {
		var output = [];
		for(var key in o) {
			output.push(key);
		}
		return output;
	};

	/** Returns an array of the object's values. */
	var values = function(o) {
		var output = [];
		for(var key in o) {
			output.push(o[key]);
		}
		return output;
	};

	/** Returns a new object with the given key and value. */
	var keyValue = function(key, value) {
		var o = {};
		o[key] = value;
		return o;
	};

	/** Join the object into a single string with the given separators separating properties from each other as well as values. */
	var joinObj = function(obj, propSeparator, valueSeparator) {
		var keyValuePairs = [];
		for(var prop in obj) {
			keyValuePairs.push(prop + valueSeparator + obj[prop]);
		}
		return keyValuePairs.join(propSeparator);
	};

	/** Returns true if the object has no non-undefined properties.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	var isEmpty = function(o) {
		var i, v;
		if (typeOf(o) === 'object') {
			for (i in o) {
				v = o[i];
				if (v !== undefined && typeOf(v) !== 'function') {
					return false;
				}
			}
		}
		return true;
	}

	/** Compares two items lexigraphically.  Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
	var compare = function(a,b) {
		return a > b ? 1 :
			a < b ? -1 :
			0;
	};

	/** Returns a function that compares the given property of two items. */
	var compareProperty = function(property) {
		return function(a,b) {
			return compare(a[property], b[property]);
		};
	};

	/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties.
	 * A property can also be appended with " ASC" or " DESC" to control the sort order.
	 * */
	var dynamicCompare = function(props) {

		if(!props || !(props instanceof Array)) {
			console.error("Invalid props");
		}

		return function(a,b) {
			var len = props.length;
			for(var i=0; i<len; i++) {
				var aVal, bVal, sortDir;
				if(typeof props[i] == "function") {
					aVal = props[i](a);
					bVal = props[i](b);
					sortDir = "asc";
				}
			
				else if(props[i].toLowerCase().indexOf(" ") >= 0) {
					var splitVal = props[i].split(" ");
					aVal = a[splitVal[0]];
					bVal = b[splitVal[0]];
					sortDir = splitVal[1].toLowerCase();
				}
				else {
					aVal = a[props[i]];
					bVal = b[props[i]];
					sortDir = "asc";
				}

				// this is important so that if the values are equial, it continues to the next sort property
				if(aVal != bVal) {
					return sortDir == "asc" ? compare(aVal,bVal) : compare(bVal,aVal);
				}
			}
			return 0;
		};
	}

	/** Returns true if all the items in a are equal to all the items in b, recursively. */
	var equals = function(a,b) {

		if(typeof(a) !== typeof(b)) {
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
		// compare scalars
		else if(typeof(a) === "number" || typeof(a) === "string" || typeof(a) === "boolean" || typeof(a) === "undefined") {
			if(a !== b) {
				return false;
			}
		}
		// compare objects
		else if(numProperties(a) === numProperties(b)) {
			for(property in a) {
				if(!(property in b && b[property] === a[property])) {
					return false;
				}
			}
		}
		else {
			return false;
		}

		return true;
	};

	/** Returns the number of properties on the given object. */
	var numProperties = function(o) {
		var n = 0;
		for(property in o) {
			n++;
		}
		return n;
	};

	/** Returns true if the given value is not undefined, null, or an empty string. */
	var hasValue = function(x) { 
		return x !== undefined && x !== null && x !== ""; 
	};

	/** Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments. */
	var merge = function(/*arguments*/) {

		var mothership = {};
		
		// iterate through each given object
		var len = arguments.length;
		for(var i=0; i<len; i++) {
			var outlier = arguments[i];
			
			// add each property to the mothership
			for(prop in outlier) {
				if(typeof outlier[prop] === "object" && outlier[prop] !== null && !(outlier[prop] instanceof Array)) {
					mothership[prop] = merge(mothership[prop], outlier[prop]); // RECURSION
				}
				else if(outlier[prop] !== undefined) {
					mothership[prop] = outlier[prop];
				}
			}
		}
		
		return mothership;
	};

	/** Returns a function that returns the inverse of the given boolean function. */
	var not = function(f) { 
		return function() { 
			return !f.apply(this, arguments); 
		} 
	};

	/** Returns a string representation of the given scalar, array, or dictionary. */
	var hash = function(o) {
		if(o === undefined) {
			return "undefined";
		}
		else if(o === null) {
			return "null";
		}
		else if(typeof(o) === "string" || typeof(o) === "number") {
			return "" + o;
		}
		else if(typeOf(o) === "array") {
			return "_[{0}]_".format(o.map(hash).join(","));
		}
		else if(typeOf(o) === "object") {
			var objString = "";
			for(prop in o) {
				objString += supplant("{0}_:_{1}", [prop, hash(o[prop])]);
			}
			return supplant("_{{0}}_", [objString]);
		}
		else {
			throw new Error("Unhashable value: " + o);
		}
	};

	/** Generates a pseudo-random string that can be assumed to be unique.
		@remarks	untestable
	*/
	var guid = (function() {
		var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return function() {
			return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
	})();

	/** Returns a string representing the type of the object, with special handling for null and arrays.
		@author	Douglas Crockford http://javascript.crockford.com/remedial.html
	*/
	var typeOf = function(value) {
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
	};

	/** Identity function. */
	var I = function(x) { return x; };

	/** A very self-conscious function. */
	var reflect = function() { console.log(this, arguments); }

	/** Returns a new function that forwards 'this' as the first parameter to the given function, and thus can be called as instance method (or prototype method ) of the object itself. 
		@param thisIndex	Forwards 'this' at the given parameter index. Default: 0.
	*/
	var toInstance = function(f, thisIndex) {
		thisIndex = thisIndex || 0;
		return function() {
			var args = Array.prototype.slice.apply(arguments);
			return f.apply(this, rotate([].concat([this], args), -thisIndex));
		};
	};

	/** Calls the given constructor and returns the new instance. Useful for higher order programmer where the new keyword won't work. 
		@warning Does not support more than 10 arguments! Done this way because accessing __proto__ directly for true variable number of arguments doesn't seem to be consistent across browsers. http://lmeyerov.blogspot.com/2007/12/wrapping-javascript-new-constructor.html
	*/
	var createNew = function(f) {
		return new f(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10]);
	};

	/** Assigns the given list of methods from the host object to the protoObj's prototype after converting them with toInstance. */
	var install = function(protoObj, host, methods, thisIndex) {
		var len = methods.length;
		for(var i=0; i<len; i++) {

			// the method can be a string if the hostKey and protoKey are the same ("contains") or an object that maps the host key to the proto key ({repeatString: "repeat"})
			var hostKey, protoKey;
			if(typeof(methods[i]) === "string") {
				hostKey = methods[i];
				protoKey = methods[i];
			}
			else {
				for(var name in methods[i]) {
					hostKey = name;
					protoKey = methods[i][name];
					break;
				}
			}

			protoObj.prototype[protoKey] = toInstance(host[hostKey], thisIndex);
		}
	};

	/** Recursively invokes the given function with no parameters until it returns a non-functional value. */
	var callTillValue = function(value) {
		return typeof(value) == "function" ? callTillValue(value()) : value;
	};

	/** Returns a new object with f(key, value) applied for each property in the given object. */
	var mapObject = function(obj, f) {
		var result = {};
		for(var key in obj) {
			result[key] = f(key, obj[key]);
		}
		return result;
	};

	/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. */
	var toArray = function(obj, f) {
		var f = f || function(key, value) { return { key: key, value: value }; };
		var result = [];
		for(var key in obj) {
			result.push(f(key, obj[key]));
		}
		return result;
	};

	/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. */
	var filterObject = function(obj, f) {
		var result = {};
		for(var key in obj) {
			if(f(key, obj[key])) {
				result[key] = obj[key];
			}
		}
		return result;
	};

	/** Returns a new array that only includes items for which f(item, i) is truthy. */
	var filter = function(arr, f) {
		var result = [];
		for(var i=0, len=arr.length; i<len; i++) {
			if(f(arr[i], i)) {
				result.push(arr[i]);
			}
		}
		return result;
	};

	/** Returns a new array that only includes items with a specific value of a given property. */
	var filterBy = function(arr, prop, value) {
		return filter(arr, function(item) {
			return item[prop] === value;
		});
	};

	/** Changes the specified keys in an object. 
		@example RJS.changeKeys(
			{ fname: "Raine", lname: "Lourie", specialty: "Javascript" }, 
			{ fname: "fname", lname: "lname" }
		)
	*/
	var changeKeys = function(obj, changedKeys) {
		var result = {};
		for(var key in obj) {
			result[key in changedKeys ? changedKeys[key] : key] = obj[key];
		}
		return result;
	};

	/** Invokes a callback after all the given asynchronous functions have completed. All asynchronous functions must accept a single callback argument. */
	var callAfterDone = function(requests, callback) {

		// defaults
		requests = requests || [];
		callback = callback || function() {};

		// an array of objects which contain a key and a response
		var responses = [];
		var isArray = typeOf(requests) == "array";
		var len = (isArray ? requests : keys(requests)).length;
		var completed = 0;

		// if the requests is empty, call the callback immediately
		if(len === 0) {
			callback();
		}

		// if all requests have returned, calls the final callback with an array of responses in the order of the original requests
		var checkAllDone = function() {
			if(completed === len) {
				if(isArray) {
					responses.sort(compareProperty("key"));
					callback(pluck(responses, "result"));
				}
				else {
					callback(toObject(responses, function(responsePair) {
						return keyValue(responsePair.key, responsePair.result);
					}));
				}
			}
		};

		// stores the given result in the responses object and checks if we're all done
		var oneDone = function(key, result) {
			completed++;
			responses.push({ key: key, result: result });
			checkAllDone();
		};

		// calls the given function for each item in the request queue. Passes the index or key to the callback function, depending if the requests queue is an array or object.
		var eachKey = function(f) {
			if(isArray) {
				for(var i=0; i<len; i++) {
					f(i);
				}
			}
			else {
				for(var key in requests) {
					f(key);
				}
			}
		};

		eachKey(function(key) {
			var req = requests[key];

			// RECURSION
			(typeOf(req) == "function" ? req : _curry(callAfterDone, req))(_curry(oneDone, key));
		});
	};
	
	// return public interface
	return {
		supplant        : supplant,
		trim            : trim,
		startsWith      : startsWith,
		before          : before,
		after           : after,
		between         : between,
		repeatString    : repeatString,
		toTitleCase     : toTitleCase,
		ordinal         : ordinal,
		mapNumber       : mapNumber,
		map             : map,
		pluck           : pluck,
		group           : group,
		orderedGroup    : orderedGroup,
		tally           : tally,
		contains        : contains,
		strictContains  : strictContains,
		unique          : unique,
		reversed        : reversed,
		index           : index,
		rotate          : rotate,
		toObject        : toObject,
		find            : find,
		findByProperty  : findByProperty,
		keys            : keys,
		values          : values,
		keyValue        : keyValue,
		joinObj         : joinObj,
		isEmpty         : isEmpty,
		compare         : compare,
		compareProperty : compareProperty,
		dynamicCompare  : dynamicCompare,
		equals          : equals,
		numProperties   : numProperties,
		hasValue        : hasValue,
		merge           : merge,
		not             : not,
		hash            : hash,
		guid            : guid,
		typeOf          : typeOf,
		I               : I,
		reflect         : reflect,
		toInstance      : toInstance,
		"new"           : createNew,
		install         : install,
		callTillValue   : callTillValue,
		mapObject       : mapObject,
		toArray         : toArray,
		filterObject    : filterObject,
		filter          : filter,
		filterBy        : filterBy,
		changeKeys      : changeKeys,
		callAfterDone   : callAfterDone
	};

})();
