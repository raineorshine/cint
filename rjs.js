/** 
 * Raine's Javascript Extensions 
 * A library of basic Javascript functions that nobody should be without.
 */

var RJS = {};

/***********************************
 * String
 ***********************************/

/** Performs variable substitution on the string, replacing items in {curly braces}.
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
RJS.supplant = function(str, o) {

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
RJS.trim = function(str) {
	return str.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
};

/** Returns true if the string starts with the given substring. */
RJS.startsWith = function(str, sub){
    return (str.indexOf(sub) === 0);
};

/** Returns the substring before the first instance of the given delimiter. */
RJS.before = function(str, delim) { 
	return str.split(delim)[0]; 
};

/** Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found. */
RJS.after = function(str, delim) {
	var delimIndex = str.indexOf(delim);
	return delimIndex >= 0 ?
		str.substring(delimIndex+delim.length) : str;
};

/** Returns the substring between the given delimiters. */
RJS.between = function(str, left, right) { 
	return RJS.before(RJS.after(str, left), right); 
};

/** Returns a single string that repeats the string n times. */
RJS.repeatString = function(str, n, delim) {
	delim = delim || "";
	return RJS.mapNumber(n, function(i) { return str; }).join(delim);
};

RJS.toTitleCase = function(str) {
	var capitalizeFirst = function(s) { return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase(); };
	return RJS.map(str.split(" "), capitalizeFirst).join(" ");
};

/***********************************
 * Number
 ***********************************/
/** Returns the ordinal value (like "1st" or "2nd") of the given integer. */
RJS.ordinal = function(n) {
	var lastDigit = n%10;
	return n + (
		n >= 11 && n <= 13 ? "th" :
		lastDigit === 1 ? "st" :
		lastDigit === 2 ? "nd" :
		lastDigit === 3 ? "rd" : 
		"th");
};

/** Invokes the given function n times, passing the index for each invocation, and returns an array of the results. */
RJS.mapNumber = function(n, f) {
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
RJS.map = function(arr, f) {
	var results = [];
	var len = arr.length;
	for(var i=0; i<len; i++) {
		results.push(f(arr[i], i));
	}
	return results;
};

/** Group the array of objects by one of the object's properties or mappable function. Returns a dictionary containing the original array's items indexed by the property value. */
RJS.group = function(arr, propOrFunc) {

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

RJS.orderedGroup = function(arr, propOrFunc) {

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
RJS.tally = function(arr) {
	var dict = {};
	var len = arr.length;
	for(var i=0; i<len; i++) {
		var count = dict[arr[i]] || 0;
		dict[arr[i]] = count + 1;
	};
	return dict;
};

/** Returns true if the array contains the given value (==). */
RJS.contains = function(arr, value) {
	var len = arr.length;
	for(var i=0; i<len; i++) {
		if(arr[i] == value) {
			return true;
		}
	}
	return false;
};

/** Returns true if the array contains the given value (===). */
RJS.strictContains = function(arr, value) {
	var len = arr.length;
	for(var i=0; i<len; i++) {
		if(arr[i] === value) {
			return true;
		}
	}
	return false;
};

/** Returns the unique values in the array. */
RJS.unique = function(arr) {
	var output = [];
	var len = arr.length;
	for(var i=0; i<len; i++) {
		if(!RJS.strictContains(output, arr[i])) {
			output.push(arr[i]);
		}
	}
	return output;
};

/** Returns the reverse of the given array. Unlike the native reverse, does not modify the original array. */
RJS.reversed = function(arr) {
	var output = [];
	for(var i=arr.length-1; i>=0; i--) {
		output.push(arr[i]);
	}
	return output;
}

/** Indexes into an array, supports negative indices. */
RJS.index = function(arr, i) {
	// one modulus to get in range, another to eliminate negative
	return arr[(i % arr.length + arr.length) % arr.length];
};

/** Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end. */
RJS.rotate = function(arr, n) {
	var output = [];
	var len = arr.length;
	for(var i=0; i<len; i++) {
		output.push(RJS.index(arr, i+n));
	}
	return output;
};

/* Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }. */
RJS.toObject = function(arr, f) {
	var keyValues = [];
	var len = arr.length;
	for(var i=0; i<len; i++) {
		keyValues.push(f(arr[i], i));
	}
	return RJS.merge.apply(arr, keyValues);
};

/** Returns the first item in the given array that returns true for the given function. If no item is found, returns false. */
RJS.find = function(arr, f) {
	var len = arr.length;
	for(var i=0; i<len; i++) {
		if(f(arr[i], i)) {
			return arr[i];
		}
	}
	return null;
};

/** Returns the first item in the given array whose specified property matches the given value. */
RJS.findByProperty = function(arr, prop, value) {
	return RJS.find(arr, function(item) {
		return item[prop] === value;
	});
};

/***********************************
 * Utility
 ***********************************/

/** Returns an array of the object's keys (converted to strings). */
RJS.keys = function(o) {
	var output = [];
	for(var key in o) {
		output.push(key);
	}
	return output;
};

/** Returns an array of the object's values. */
RJS.values = function(o) {
	var output = [];
	for(var key in o) {
		output.push(o[key]);
	}
	return output;
};

/** Returns a new object with the given key and value. */
RJS.keyValue = function(key, value) {
	var o = {};
	o[key] = value;
	return o;
};

/** Join the object into a single string with the given separators separating properties from each other as well as values. */
RJS.joinObj = function(obj, propSeparator, valueSeparator) {
	var keyValuePairs = [];
	for(var prop in obj) {
		keyValuePairs.push(prop + valueSeparator + obj[prop]);
	}
	return keyValuePairs.join(propSeparator);
};

/** Returns true if the object has no non-undefined properties.
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
RJS.isEmpty = function(o) {
    var i, v;
    if (RJS.typeOf(o) === 'object') {
        for (i in o) {
            v = o[i];
            if (v !== undefined && RJS.typeOf(v) !== 'function') {
                return false;
            }
        }
    }
    return true;
}

/** Compares two items lexigraphically.  Returns 1 if a>b, 0 if a==b, or -1 if a<b. */
RJS.compare = function(a,b) {
	return a > b ? 1 :
		a < b ? -1 :
		0;
};

/** Returns a function that compares the given property of two items. */
RJS.compareProperty = function(property) {
	return function(a,b) {
		return RJS.compare(a[property], b[property]);
	};
};

/** Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties.
 * A property can also be appended with " ASC" or " DESC" to control the sort order.
 * */
RJS.dynamicCompare = function(props) {

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
				return sortDir == "asc" ? RJS.compare(aVal,bVal) : RJS.compare(bVal,aVal);
			}
		}
		return 0;
	};
}

/** Returns true if all the items in a are equal to all the items in b, recursively. */
RJS.equals = function(a,b) {

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
			if(!b || !b[i] || !RJS.equals(a[i], b[i])) { // RECURSION
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
RJS.numProperties = function(o) {
	var n = 0;
	for(property in o) {
		n++;
	}
	return n;
};

/** Returns true if the given value is not undefined, null, or an empty string. */
RJS.hasValue = function(x) { 
	return x !== undefined && x !== null && x !== ""; 
};

/** Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments. */
RJS.merge = function(/*arguments*/) {

	var mothership = {};
	
	// iterate through each given object
	var len = arguments.length;
	for(var i=0; i<len; i++) {
		var outlier = arguments[i];
		
		// add each property to the mothership
		for(prop in outlier) {
			if(typeof outlier[prop] === "object" && outlier[prop] !== null && !(outlier[prop] instanceof Array)) {
				mothership[prop] = RJS.merge(mothership[prop], outlier[prop]); // RECURSION
			}
			else if(outlier[prop] !== undefined) {
				mothership[prop] = outlier[prop];
			}
		}
	}
	
	return mothership;
};

/** Returns a function that returns the inverse of the given boolean function. */
RJS.not = function(f) { 
	return function() { 
		return !f.apply(this, arguments); 
	} 
};

/** Returns a string representation of the given scalar, array, or dictionary. */
RJS.hash = function(o) {
	if(o === undefined) {
		return "undefined";
	}
	else if(o === null) {
		return "null";
	}
	else if(typeof(o) === "string" || typeof(o) === "number") {
		return "" + o;
	}
	else if(RJS.typeOf(o) === "array") {
		return "_[{0}]_".format(o.map(hash).join(","));
	}
	else if(RJS.typeOf(o) === "object") {
		var objString = "";
		for(prop in o) {
			objString += RJS.supplant("{0}_:_{1}", [prop, RJS.hash(o[prop])]);
		}
		return RJS.supplant("_{{0}}_", [objString]);
	}
	else {
		throw new Error("Unhashable value: " + o);
	}
};

/** Generates a pseudo-random string that can be assumed to be unique.
	@remarks	untestable
*/
RJS.guid = (function() {
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
RJS.typeOf = function(value) {
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
RJS.I = function(x) { return x; };

/** A very self-conscious function. */
RJS.reflect = function() { console.log(this, arguments); }

/** Geturns a new function that forwards 'this' as the first parameter to the given function, and thus can be called as instance method (or prototype method ) of the object itself. 
	@param thisIndex	Forwards 'this' at the given parameter index. Default: 0.
*/
RJS.toInstance = function(f, thisIndex) {
	thisIndex = thisIndex || 0;
	return function() {
		var args = Array.prototype.slice.apply(arguments);
		return f.apply(this, RJS.rotate([].concat([this], args), -thisIndex));
	};
};

/** Assigns the given list of methods from the host object to the protoObj's prototype after converting them with toInstance. */
RJS.install = function(protoObj, host, methods, thisIndex) {
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

		protoObj.prototype[protoKey] = RJS.toInstance(host[hostKey], thisIndex);
	}
};

/** Recursively invokes the given function with no parameters until it returns a non-functional value. */
RJS.callTillValue = function(value) {
	return typeof(value) == "function" ? RJS.callTillValue(value()) : value;
};

/** Returns a new object with f(key, value) applied for each property in the given object. */
RJS.mapObject = function(obj, f) {
	var result = {};
	for(var key in obj) {
		result[key] = f(key, obj[key]);
	}
	return result;
};

/** Returns an array whose items are the result of calling f(key, value) on each property of the given object. */
RJS.toArray = function(obj, f) {
	var f = f || function(key, value) { return { key: key, value: value }; };
	var result = [];
	for(var key in obj) {
		result.push(f(key, obj[key]));
	}
	return result;
};

/** Returns a new object that only includes the properties of the given obj for which f(key, value) is true. */
RJS.filterObject = function(obj, f) {
	var result = {};
	for(var key in obj) {
		if(f(key, obj[key])) {
			result[key] = obj[key];
		}
	}
	return result;
};

/** Changes the specified keys in an object. 
	@example RJS.changeKeys(
		{ fname: "Raine", lname: "Lourie", specialty: "Javascript" }, 
		{ fname: "fname", lname: "lname" }
	)
*/
RJS.changeKeys = function(obj, changedKeys) {
	var result = {};
	for(var key in obj) {
		result[key in changedKeys ? changedKeys[key] : key] = obj[key];
	}
	return result;
};

/** Invokes a callback after all the given asynchronous functions have completed. All asynchronous functions must accept a single callback argument. */
RJS.callAfterDone = function(queue, callback) {

	// defaults
	queue = queue || [];
	callback = callback || function() {};

	var count = queue.length;

	// if the queue is empty, call the callback immediately
	if(count === 0) {
		callback();
	}
	// otherwise, call each function in the queue with a callback that decrements the count. When the count of remaining functions hits 0, call the final callback.
	else {
		var decAndCheck = function() {
			if(--count <= 0) {
				callback();
			}
		};

		var len = queue.length;
		for(var i=0; i<len; i++) {
			queue[i](decAndCheck);
		}
	}
};


