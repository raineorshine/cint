QUnit.module('cint');

/***********************************
 * String
 ***********************************/

test('supplant', function() {

	equal(cint.supplant('{0} walks his {1} in the {2}.', 
		['Jim', 'dinosaur', 'park']), 
		'Jim walks his dinosaur in the park.', 
		'Supplant with array by index');

	equal(cint.supplant('{owner} walks his {pet} in the {place}.', 
		{ owner: 'Jim', pet: 'dinosaur', place: 'park' }), 
		'Jim walks his dinosaur in the park.', 
		'Supplant with object by key');

	equal(cint.supplant('{owner} walks his {pet} in the {place}.', 
		{ owner: 'Jim', pet: 'dinosaur', place: 'park' }), 
		'Jim walks his dinosaur in the park.', 
		'Supplant with object by key');

	equal(cint.supplant('{owner} walks his {pet} in the {place}.', 
		{ owner: 'Jim', pet: 'dinosaur' }), 
		'Jim walks his dinosaur in the {place}.', 
		'Ignores non-existant keys');

	var Dino = function() {};
	Dino.prototype.toString = function() { return 'dinosaur'; };
	equal(cint.supplant('{owner} walks his {pet}.', 
		{ owner: 'Jim', pet: new Dino() }), 
		'Jim walks his dinosaur.', 
		'toStrings all values to be interpolated');
})

test('startsWith', function() {
	equal(cint.startsWith('abc', 'a'), true, 'abc starts with a')
	equal(cint.startsWith('abc', 'c'), false, 'abc doesn\'t start with c')
	equal(cint.startsWith('abc', ''), false, 'Testing if something starts with empty string is always false.')
})

test('before', function() {
	equal(cint.before('ab,cd,ef', ','), 'ab', 'Return the substring before the given delimiter')
})

test('after', function() {
	equal(cint.after('ab,cd,ef', ','), 'cd,ef', 'Return the substring after the first given delimiter')
})

test('between', function() {
	equal(cint.between('abcdef', 'ab', 'ef'), 'cd', 'Return the substring between the given two delimiters')
})

test('bookend', function() {
	equal(cint.bookend('b', 'a', 'c'), 'abc', 'Add a string to the beginning and a string to the end of a string.')
	equal(cint.bookend('b', 'a'), 'aba', 'Wrap a string with another string')
	equal(cint.bookend('b'), 'b', 'Ignores falsey begin and end values')
})

test('repeatString', function() {
	equal(cint.repeatString('abc', 3), 'abcabcabc', 'Repeat a string n times')
	equal(cint.repeatString('abc', 0), '', 'Repeating a string 0 times returns an empty string')
})

test('toTitleCase', function() {
	equal(cint.toTitleCase('this is a test'), 'This Is A Test', 'Capitalize the first letter of each word in a sentence')
	equal(cint.toTitleCase('tHis is A tEst'), 'This Is A Test', 'Lowercase the rest')
	equal(cint.toTitleCase('don\'t fail the test.'), 'Don\'t Fail The Test.', 'Do not alter punctuation.')
})


/***********************************
 * Number
 ***********************************/

test('ordinal', function() {
	equal(cint.ordinal(1), '1st')
	equal(cint.ordinal(2), '2nd')
	equal(cint.ordinal(3), '3rd')
	equal(cint.ordinal(4), '4th')
	equal(cint.ordinal(5), '5th')
	equal(cint.ordinal(6), '6th')
	equal(cint.ordinal(7), '7th')
	equal(cint.ordinal(8), '8th')
	equal(cint.ordinal(9), '9th')
	equal(cint.ordinal(10), '10th')
	equal(cint.ordinal(11), '11th')
	equal(cint.ordinal(12), '12th')
	equal(cint.ordinal(13), '13th')
	equal(cint.ordinal(14), '14th')
	equal(cint.ordinal(15), '15th')
	equal(cint.ordinal(16), '16th')
	equal(cint.ordinal(17), '17th')
	equal(cint.ordinal(18), '18th')
	equal(cint.ordinal(19), '19th')
	equal(cint.ordinal(20), '20th')
	equal(cint.ordinal(21), '21st')
	equal(cint.ordinal(22), '22nd')
	equal(cint.ordinal(23), '23rd')
	equal(cint.ordinal(24), '24th')
	equal(cint.ordinal(100), '100th')
	equal(cint.ordinal(101), '101st')
	equal(cint.ordinal(102), '102nd')
	equal(cint.ordinal(103), '103rd')
	equal(cint.ordinal(104), '104th')
})

test('mapNumber', function() {
	var xTwo = function(n) { return n*2 }
	deepEqual(cint.mapNumber(3, xTwo), [0, 2, 4])
})

test('addTwo', function() {
	equal(cint.addTwo(4,5), 9, 'Add two numbers.')
})

test('add', function() {
	equal(cint.add(), 0, 'No arguments returns 0')
	equal(cint.add(1), 1, '1 argument returns the argument')
	equal(cint.add(1,2), 3, '2 arguments are added')
	equal(cint.add(1,2,3), 6, 'More than 2 arguments are added')
})

/***********************************
 * Array
 ***********************************/

// test('orderedGroup', function() {
// })

// test('tally', function() {
// })

test('tallyProps', function() {

	var data = [
		{
			ideal: 4,
			past: 3,
			present: 7
		},
		{
			ideal: 3,
			past: 7,
			present: 7
		}
	]

	var expectedTallies = {
		"4": {
			ideal: 1
		},
		"3": {
			past: 1,
			ideal: 1
		},
		"7": {
			present: 2,
			past: 1
		}
	}

	deepEqual(cint.tallyProps(data), expectedTallies, 'Tally property values')

})

test('index', function() {
	var arr = [1,2,3,4,5];
	equal(cint.index(arr, 2), 3, 'Index into an array as normal');
	equal(cint.index(arr, -1), 5, 'Negative index');
	equal(cint.index(arr, 16), 2, 'Out of bounds index');

	var str = 'abcde';
	equal(cint.index(str, 2), 'c', 'Index into an array-like object as normal')
	equal(cint.index(str, -1), 'e', 'Negative index of array-like object')
	equal(cint.index(str, 16), 'b', 'Out of bounds index of array-like object')
});

test('rotate', function() {
	var arr = ['a', 'b', 'c']
	var resultArr = cint.rotate(arr, 0)
	deepEqual(resultArr, ['a', 'b', 'c'], 'Rotate array 0 spaces.')
	deepEqual(cint.rotate(['a', 'b', 'c'], 1), ['b', 'c', 'a'], 'Rotate array 1 space to the left.')
	notEqual(arr, resultArr, 'Returns a new array instance')
	deepEqual(arr, ['a', 'b', 'c'], 'Does not modify the original array')
	deepEqual(cint.rotate(['a', 'b', 'c'], 5), ['c', 'a', 'b'], 'Rotate an array more spaces than its length.')
	deepEqual(cint.rotate(['a', 'b', 'c'], -1), ['c', 'a', 'b'], 'Rotate array 1 space to the left.')
})

test('toObject', function() {
	var animals = ['cat', 'dog', 'gecko']
	var pluralAnimals = cint.toObject(animals, function(animal) {
	  return cint.keyValue(animal, animal + 's')
	})
	deepEqual(pluralAnimals, {
		cat: 'cats',
		dog: 'dogs',
		gecko: 'geckos'
	})
})

test('spliced', function() {
	var arr = [1,2,3,4,5];
	deepEqual(cint.spliced(arr, 2, 1, 100, 200, 300), [1,2,100,200,300,4,5]);
	deepEqual(arr, [1,2,3,4,5], 'Original array is unchanged.');
})

test('chunk', function() {
	var arr = [1,2,3,4,5,6,7,8,9,10];
	deepEqual(cint.chunk(arr, 1), [[1,2,3,4,5,6,7,8,9,10]]);
	deepEqual(cint.chunk(arr, 2), [[1,2,3,4,5], [6,7,8,9,10]]);
	deepEqual(cint.chunk(arr, 3), [[1,2,3,4], [5,6,7], [8,9,10]]);
	deepEqual(cint.chunk(arr, 7), [[1,2], [3,4], [5,6], [7], [8], [9], [10]]);
	deepEqual(cint.chunk(arr, 10), [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]);
	deepEqual(arr, [1,2,3,4,5,6,7,8,9,10], 'Original array is unchanged');
})



/***********************************
 * Object
 ***********************************/

// object
test('keyValue', function() {
  deepEqual(cint.keyValue('a',1), {a:1}, 'Creates a key-value pair.')
  notEqual(cint.keyValue('a',1), cint.keyValue('a',1), 'Creates a new object instance each time.')
})

test('getValue', function() {

  var o = {a:1};
  equal(cint.getValue(o, 'a'), 1, 'Gets the value of a key of the gven object')

})

test('setValue', function() {

  var o = {a:1};
  cint.setValue(o, 'a', 2)
  deepEqual(o, {a:2}, 'Sets the value of the given existing key')

  cint.setValue(o, 'b', 10)
  deepEqual(o, {a:2, b:10}, 'Sets the value of the given new key')

  equal(cint.setValue(o, 'a', 10), o, 'Returns the object')

})

test('mapOverKey', function() {
  
  var people = [
  	{ name: 'Bob', age: 26 },
  	{ name: 'Tia', age: 32 },
  	{ name: 'José', age: 40 }
  ];
  var olderPeople = [
  	{ name: 'Bob', age: 27 },
  	{ name: 'Tia', age: 33 },
  	{ name: 'José', age: 41 }
  ];
  var increment = function(n) { return ++n }
	var incrementAge = cint.mapOverKey(increment, 'age')
	deepEqual(people.map(incrementAge), olderPeople, 'Maps the given function over the values of a key')

  var nextPeople = [
  	{ name: 'Bob', age: 27, nextAge: 28 },
  	{ name: 'Tia', age: 33, nextAge: 34 },
  	{ name: 'José', age: 41, nextAge: 42 }
  ];
	var incrementNextAge = cint.mapOverKey(increment, 'age', 'nextAge')
	deepEqual(people.map(incrementNextAge), nextPeople, 'Maps the given function over the values of a key and assigns them to a new key')

})

test('joinObject', function() {
	var o = { a: 1, b: 2, c: 3 };
	equal(cint.joinObject(o, '&', '='), 'a=1&b=2&c=3', 'Join object keys and values together into a string')
	equal(cint.joinObject({}, '&', '='), '', 'Empty object gets joined into an empty string')
})

test('mapObject', function() {
	var o = { a: 1, b: 2, c: 3 };
	var swap = function(k,v) { return cint.keyValue(v,k); };
	deepEqual(cint.mapObject(o, swap), { '1': 'a', '2': 'b', '3': 'c' });
});

test('toArray', function() {
	var o = { a: 1, b: 2, c: 3 };

	deepEqual(cint.toArray(o, function(key, value) {
	  return key + '-' + value;
	}), ['a-1', 'b-2', 'c-3'], 'Convert an object to an array')

	deepEqual(cint.toArray(o), [
		{ key: 'a', value: 1 },
		{ key: 'b', value: 2 },
		{ key: 'c', value: 3 }
	], 'Convert an object to an array of { key: ____, value: ____ } objects if no function is given.')
})

test('filterObject', function() {
	var o = { a: 1, b: 2, c: 3 }

	deepEqual(cint.filterObject(o, function(key, value) {
	  return key !== 'b' && value !== 3
	}), { a: 1 }, 'Filter an object based on its keys and values')

	deepEqual(o, { a: 1, b: 2, c: 3 }, 'Original object is not modified.')
})

test('changeKeys', function() {
	// Assertions, ok, equal, notEqual, deepEqual, notDeepEqual, strictEqual, notStrictEqual
	var oldObject = { fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' };
	var newObject = cint.changeKeys( oldObject, { fname: 'first', lname: 'last' });
	deepEqual(oldObject, { fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' }, 'Old object is unmodified.');
	deepEqual(newObject, { first: 'Raine', last: 'Lourie', specialty: 'Javascript' }, 'New object ontains modified keys.');

});

test('tap', function() {
  
	var o = { a: 10 }
	var incrementA = function(o) { o.a++ }

	equal(cint.tap(incrementA, o), o, 'Returns the given object')
	deepEqual(o, { a: 11 }, 'Invokes the given function on the object')

})

test('look', function() {
	equal(cint.look('test:look'), 'test:look', 'Returns the argument')
	// Cant' really test the console.log
})


/***********************************
 * Function
 ***********************************/

test('not', function() {
	var yes = function() { return true; };
	var no = function() { return false; };
	var I = function(x) { return x; };
	equal(cint.not(yes)(), false, 'Reverses true to false.');
	equal(cint.not(no)(), true, 'Reverses false to true.');
	equal(cint.not(I)(true), false, 'Works with arguments.');
	equal(cint.not(I)(false), true, 'Works with arguments.');
	equal(cint.not(I)('a'), false, 'Works with non-booleans.');
	equal(cint.not(I)(undefined), true, 'Works with non-booleans');
});

test('partialAt', function() {
	var subtract = function(x,y) { return x - y; };
	var subtractFromTen = cint.partialAt(subtract, 0, [10]);
	equal(subtractFromTen(1), 9, 'Inject arguments at the beginning.');

	var subtractTen = cint.partialAt(subtract, 1, [10]);
	equal(subtractTen(100), 90, 'Inject arguments in the middle.');

	var subtractTwenty = cint.partialAt(subtract, -1, [20])
	equal(subtractTwenty(100), 80, 'Handles negative indexes');
});

test('aritize', function() {
	var joinEm = function() { 
		var givenArgs = Array.prototype.slice.call(arguments, 0);
		return givenArgs.join('');
	};
	var joinTwo = cint.aritize(joinEm, 2);
	equal(joinTwo('a', 'b', 'c', 'd', 'e'), 'ab');
});

// test('callTillValue', function() {
// })

test('spy', 3, function() {
	
	function add(x, y) { return x + y; }

	function log(f, args, out) { 
		equal(f, add, 'first argument is the function');
		deepEqual(args, [1,2], 'second argument is an array of arguments to that function');
		equal(out, 3, 'third argument is the return value of the function');
	}

	cint.spy(add, log)(1,2);
})

test('inContext', function() {
	var person = { name: 'Cecil' }
	var getName = function() { return this.name }
	var getNameInContext = cint.inContext(getName)
	equal(getNameInContext(person), 'Cecil', 'calls the given function in the context of the first argument')

	var greet = function(greeting) { return greeting + ' ' + this.name }
	var greetInContext = cint.inContext(greet)
	equal(greetInContext(person, 'Hi'), 'Hi Cecil', 'passes other arguments as normal')
});


/***********************************
 * Utility
 ***********************************/

test('compare', function() {
	equal(cint.compare(2,1), 1, 'Returns 1 if a > b')
	equal(cint.compare(1,1), 0, 'Returns 0 if a == b')
	equal(cint.compare(1,2), -1, 'Returns -1 if a < b')
	equal(cint.compare('ace', 'Ann'), 1, 'Returns 1 if a > b for strings')
	equal(cint.compare('ace', 'ace'), 0, 'Returns 0 if a == b for strings')
	equal(cint.compare('Ann', 'ace'), -1, 'Returns -1 if a < b for strings')
})

test('compareProperty', function() {
	var small = { n: 1 }
	var big = { n: 2 }
	var compareN = cint.compareProperty.bind(cint, 'n')
	equal(compareN(big, small), 1, 'Returns 1 if a > b')
	equal(compareN(big, big), 0, 'Returns 0 if a == b')
	equal(compareN(small, big), -1, 'Returns -1 if a < b')
})

// test('dynamicCompare', function() {
// })

// test('equals', function() {
// })

test('isValue', function() {
	equal(cint.isValue(null), false, 'false is not valueful')
	equal(cint.isValue(undefined), false, 'undefined is not valueful')
	equal(cint.isValue(''), false, 'empty string is not valueful')
	equal(cint.isValue(0), true, '0 is valueful')
	equal(cint.isValue(1), true, '1 is valueful')
	equal(cint.isValue(false), true, 'false is valueful')
	equal(cint.isValue(true), true, 'true is valueful')
	equal(cint.isValue('test'), true, 'a string is valueful')
})

// test('hash', function() {
// })

// test('guid', function() {
// })

test('typeOf', function() {
	equal(cint.typeOf(null), 'null')
	equal(cint.typeOf(undefined), 'undefined')
	equal(cint.typeOf('test'), 'string')
	equal(cint.typeOf(1), 'number')
	equal(cint.typeOf([]), 'array')
	equal(cint.typeOf({}), 'object')
	equal(cint.typeOf(function(){}), 'function')
})

test('new', function() {
	var Person = function(name, age) {
		this.name = name;
		this.age = age;
	};
	var p = cint.new(Person, ['Raine', 26]);
	ok(p instanceof Person);
	equal(p.name, 'Raine');
	equal(p.age, 26);
});

test('intoString', function(assert) {
	equal(cint.intoString(4), '4', 'Converts a number to a string')
	equal(cint.intoString(true), 'true', 'Converts a boolean to a string')
	// Can't get assert.throws to work as documented here:
	// http://api.qunitjs.com/throws/
	// assert.throws(
	// 	function() {
	// 		cint.intoString(null);
	// 	},
	// 	new TypeError('Cannot read property \'toString\' of null'),
	// 	'Passing null throws a TypeError'
	// )
	// assert.throws(
	// 	cint.intoString.bind(cint, undefined),
	// 	new TypeError('Cannot read property \'toString\' of undefined'),
	// 	'Passing undefined throws a TypeError'
	// )
})

