/** 
 * Raine's Javascript Extensions 
 * A library of basic Javascript functions that nobody should be without.
 */

/***********************************
 * String overrides
 ***********************************/

/** Replaces occurrences of {0}, {1}, ... with each additional argument passed.  Like sprintf. 
	DEPRECATED: Use supplant instead.
*/
String.prototype.format = (function() { 
	
	// private vars
	var preRE = [];
	
	return function() {

		var str = this;

		for(var i=0, l=arguments.length; i<l; i++) {
			// cache regular expression
			if(!preRE[i]) {
				preRE[i] = new RegExp();
				preRE[i].compile('\\{' + (i) + '\\}','gm');
			}
			str = str.replace(preRE[i], arguments[i]);
		}

		return str;
	}
})();

/** Performs variable substitution on the string, replacing items in {curly braces}.
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};

/** Removes whitespace from both ends of a string.
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
String.prototype.trim = function () {
	return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
};

/** Returns true if the string starts with the given substring. */
String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
};

/** Encodes angled brackets and ampersands as HTML entities.
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
String.prototype.entityify = function () {
	return this
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
};

/** Produces a quoted string. 
	@author	Douglas Crockford http://javascript.crockford.com/remedial.html
*/
String.prototype.quote = function () {
	var c, i, l = this.length, o = '"';
	for (i = 0; i < l; i += 1) {
		c = this.charAt(i);
		if (c >= ' ') {
			if (c === '\\' || c === '"') {
				o += '\\';
			}
			o += c;
		} else {
			switch (c) {
			case '\b':
				o += '\\b';
				break;
			case '\f':
				o += '\\f';
				break;
			case '\n':
				o += '\\n';
				break;
			case '\r':
				o += '\\r';
				break;
			case '\t':
				o += '\\t';
				break;
			default:
				c = c.charCodeAt();
				o += '\\u00' + Math.floor(c / 16).toString(16) +
					(c % 16).toString(16);
			}
		}
	}
	return o + '"';
};

if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    };
}

/***********************************
 * Function overrides
 ***********************************/

/**
 * Returns a function that applies the underlying function
 * to the result of the application of `fn`.
 *
 * Based on Functional library by Oliver Steele
 * http://osteele.com/javascripts/functional
 */
Function.prototype.compose = function(fn) {
    var self = this;
    return function() {
        return self.apply(this, [fn.apply(this, arguments)]);
    }
};
/**
 * Returns a function that applies the underlying function
 * to the result of the application of `fn`.
 */
Function.prototype.sequence = function(fn) {
    var self = this;
    return function() {
        return fn.apply(this, [self.apply(this, arguments)]);
    }
};
/**
 * Returns a function that, applied to an argument list $arg2$,
 * applies the underlying function to $args ++ arg2$.
 * :: (a... b... -> c) a... -> (b... -> c)
 * == f.curry(args1...)(args2...) == f(args1..., args2...)
 */
Function.prototype.curry = function(/*args...*/) {
    var fn = this;
    var args = Array.slice(arguments, 0);
    return function() {
        return fn.apply(this, args.concat(Array.slice(arguments, 0)));
    };
};
/*
 * Right curry.  Returns a function that, applied to an argument list $args2$,
 * applies the underlying function to $args2 + args$.
 * == f.curry(args1...)(args2...) == f(args2..., args1...)
 * :: (a... b... -> c) b... -> (a... -> c)
 */
Function.prototype.rcurry = function(/*args...*/) {
    var fn = this;
    var args = Array.slice(arguments, 0);
    return function() {
        return fn.apply(this, Array.slice(arguments, 0).concat(args));
    };
};

/** Calls the function in the scope of the given object. */
Function.prototype.Context = function(obj) {
	var fnReference = this;
	return function () {
		return typeof fnReference == "function" ? fnReference.apply(obj, arguments) : obj[fnReference].apply(obj, arguments);
	};
};


/***********************************
 * Functional
 ***********************************/

/** Returns a new array consisting of f applied to each item of the given array. 
	@param collection		An array or object of items.
	@param f				If collection is an array, (item index) => newValue.
							If collection is an object, (key value index) => [newKey, newValue] or (key value index) => newValue.
*/
var map = function(collection, f, context) {

	// error handling
	if(!collection) {
		throw new Error("Array is null or undefined.");
	}
	else if(!f || !f.apply) {
		throw new Error("You must provide a valid function as the second argument to map: " + f);
	}

	// array version
	if(collection.length || collection.length === 0) {
		var newArray = [];
		for(var i=0, n=collection.length; i<n; i++) {
			newArray[i] = f.apply(context, [collection[i], i]);
		}
		return newArray;
	}
	// object version
	else {
		var newObj = {};
		var i=0;
		for(var prop in collection) {
			var result = f.apply(context, [prop, collection[prop], i])
			if(result && result.key && result.value) {
				newObj[result.key] = result.value;
			}
			else {
				newObj[prop] = result;
			}
			i++;
		}
		return newObj;
	}
};
Array.prototype.map = function(f, context) {
	return map(this, f, context);
};

/** Returns a new array consisting of a subset of arr for which the given function returns truthy. */
var filter = function(arr, f, context) {
	var newArray = [];
	for(var i=0, n=arr.length; i<n; i++) {
		if(f.apply(context, [arr[i], i])) {
			newArray.push(arr[i]);
		}
	}
	return newArray;
};
Array.prototype.filter = function(f, context) {
	return filter(this, f, context);
};

/**
 * Applies `fn` to `init` and the first element of `sequence`,
 * and then to the result and the second element, and so on.
 * == reduce(f, init, [x0, x1, x2]) == f(f(f(init, x0), x1), x2)
 * :: (a b -> a) a [b] -> a
 * >> reduce('x y -> 2*x+y', 0, [1,0,1,0]) -> 10
 * 	 (from Oliver Steele's Functional Javascript library)
 */
var reduce = function(fn, init, sequence, context) {
    //fn = Function.toFunction(fn);
	sequence = [].concat(sequence);
    var len = sequence.length,
        result = init;
    for (var i = 0; i < len; i++)
        result = fn.apply(context, [result, sequence[i]]);
    return result;
};
 
/** Returns a list of integers from min (default: 0) to max (inclusive). */
var range = function(min, max) {

	// override for 1 argument
	if(arguments.length == 1) {
		max = min - 1;
		min = 0;
	}

	var arr = [];
	for(var i=min; i<=max; i++) {
		arr.push(i);
	}
	return arr;
};


/** Applies the given function to each item in the array.  Same as map but doesn't build and return an array. */
var each = function(arr, f, context) {
	for(var i=0, n=arr.length; i<n; i++) {
		f.apply(context, [arr[i], i]);
	}
};
Array.prototype.each = function(f, context) {
	return each(this, f, context);
};

/** Returns the first item in arr for which the function f returns true.  Returns null if no matches are found. */
var find = function(arr, f, context) {
	for(var i=0, n=arr.length; i<n; i++) {
		if(f.apply(context, [arr[i], i])) {
			return arr[i];
		}
	}

	return null;
};
Array.prototype.find = function(f, context) {
	return find(this, f, context);
};

/** Returns true if the array contains the given item (compared by address, but works by value for strings). */
var contains = function(arr, item) {
	for(var i=0, n=arr.length; i<n; i++) {
		if(arr[0] === item) {
			return true;
		}
	}

	return false;
};
Array.prototype.contains = function(item) {
	return contains(this, item);
};

/** Returns an array of values of the given property for each item in the array. */
var pluck = function(arr, property) {
	return map(arr, function(item) {
		return item[property];
	});
};
Array.prototype.pluck = function(property) {
	return pluck(this, property);
};

/** Group the array of objects by one of the object's properties. Returns a dictionary containing the original arrays items indexed by the property value. */
var group = function(arr, propOrFunc) {

	if(!propOrFunc) {
		throw new Error("You must specific a property name or mappable function.");
	}

	var dict = {};
	each(arr, function(item) {
		if(!(item[propOrFunc] in dict)) {
			dict[item[propOrFunc]] = [];
		}
		dict[item[propOrFunc]].push(item);
	});
	return dict;
}
Array.prototype.group = function(propOrFunc) {
	return group(this, propOrFunc);
};

/***********************************
 * Array/Object/Utility
 ***********************************/

/** Returns an array of the object's keys. */
var keys = function(obj) {
	var newArray = [];
	for(var property in obj) {
		newArray.push(property);
	}
	return newArray;
};

/** Returns an array of the object's values. */
var values = function(obj) {
	var newArray = [];
	for(var property in obj) {
		newArray.push(obj[property]);
	}
	return newArray;
};

/** Converts an array to a dictionary given a function that takes an array value and returns a 2-part array of the key and value. */
var toDict = function(arr, makeKeyValue) {
	var dict = {};
	arr.each(function(item) {
		kvp = makeKeyValue(item);
		dict[kvp[0]] = kvp[1];
	});
	return dict;
};
Array.prototype.toDict = function(makeKeyValues) { return toDict(this, makeKeyValues); };

/** Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array. */
var tally = function(arr) {
	var dict = {};
	arr.each(function(value) {
		var count = dict[value] || 0;
		dict[value] = count + 1;
	});
	return dict;
};
Array.prototype.tally = function() { return tally(this); };

/** Returns the unique values in the array. */
var unique = function(arr) {
	return keys(tally(arr));
};
Array.prototype.unique = function() { return unique(this); };

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
		a == b ? 0 :
		-1;
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
	return function(a,b) {
		for(var i=0; i<props.length; i++) {
			var aVal, bVal, sortDir;
			if(typeof props[i] == "function") {
				aVal = props[i](a);
				bVal = props[i](b);
				sortDir = "asc";
			}
			// TODO: find a way to support directional sorting without breaking if the property has a space in it
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
			if(aVal != bVal) {
				return sortDir == "asc" ? 
					aVal > bVal ? 1 : -1 : 
					aVal < bVal ? -1 : 1;
			}
		}
		return false;
	};
};

/** Returns true if all the items in a are equal to all the items in b, recursively. */
var equals = function(a,b) {
	// compare arrays
	if(a instanceof Array) {

		// check if the arrays are the same length
		if(a.length !== b.length) {
			return false;
		}

		// check the equality of each item
		for(var i=0, l=a.length; i<l; i++) {
			if(!b || !b[i] || !equals(a[i], b[i])) {
				return false;
			}
		}
	}
	// compare objects
	if(numProperties(a) > 0 && numProperties(a) == numProperties(b)) {
		for(property in a) {
			if(!(property in b && b[property] == a[property])) {
				return false;
			}
		}
	}
	// compare scalars
	else {
		if(a !== b) {
			return false;
		}
	}

	return true;
};

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
	for(var i=0; i<arguments.length; i++) {
		var outlier = arguments[i];
		
		// add each property to the mothership
		for(prop in outlier) {
			if(typeOf(outlier[prop]) == "object") {
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
			objString += "{0}_:_{1}".format(prop, hash(o[prop]));
		}
		return "_{{0}}_".format(objString);
	}
	else {
		throw new Error("Unhashable value: " + o);
	}
};

/** Generates a pseudo-random string that can be assumed to be unique. */
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
var I = function(x) { return x; }

/***********************************
 * Assertions
 ***********************************/

/** Asserts that a is truthy. */
var assert = function(a) {
	if(!a) {
		console.error("Assertion failure: {0}".format(a));
	}
};

/** Asserts that a is equal to b, using recursive equality checking for arrays. */
var assertEquals = function(a,b) {
	if(!equals(a,b)) {
		console.error("Assertion failure: {0} === {1}".format(a,b));
	}
};

