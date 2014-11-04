QUnit.module('cint');

// function
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


// array
test('spliced', function() {
	var arr = [1,2,3,4,5];
	deepEqual(cint.spliced(arr, 2, 1, 100, 200, 300), [1,2,100,200,300,4,5]);
	deepEqual(arr, [1,2,3,4,5], 'Original array is unchanged.');
});

test('chunk', function() {
	var arr = [1,2,3,4,5,6,7,8,9,10];
	deepEqual(cint.chunk(arr, 1), [[1,2,3,4,5,6,7,8,9,10]]);
	deepEqual(cint.chunk(arr, 2), [[1,2,3,4,5], [6,7,8,9,10]]);
	deepEqual(cint.chunk(arr, 3), [[1,2,3,4], [5,6,7], [8,9,10]]);
	deepEqual(cint.chunk(arr, 7), [[1,2], [3,4], [5,6], [7], [8], [9], [10]]);
	deepEqual(cint.chunk(arr, 10), [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]);
	deepEqual(arr, [1,2,3,4,5,6,7,8,9,10], 'Original array is unchanged');
})


test('mapObject', function() {
	var o = { a: 1, b: 2, c: 3 };
	var swap = function(k,v) { return cint.keyValue(v,k); };
	deepEqual(cint.mapObject(o, swap), { '1': 'a', '2': 'b', '3': 'c' });
});

test('changeKeys', function() {
	// Assertions, ok, equal, notEqual, deepEqual, notDeepEqual, strictEqual, notStrictEqual
	var oldObject = { fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' };
	var newObject = cint.changeKeys( oldObject, { fname: 'first', lname: 'last' });
	deepEqual(oldObject, { fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' }, 'Old object is unmodified.');
	deepEqual(newObject, { first: 'Raine', last: 'Lourie', specialty: 'Javascript' }, 'New object ontains modified keys.');

});

test('index (array)', function() {
	var arr = [1,2,3,4,5];
	equal(cint.index(arr, 2), 3, 'Index into an array as normal');
	equal(cint.index(arr, -1), 5, 'Negative index');
	equal(cint.index(arr, 16), 2, 'Out of bounds index');
});

test('index (string)', function() {
	var str = 'abcde';
	equal(cint.index(str, 2), 'c', 'Index into an array as normal');
	equal(cint.index(str, -1), 'e', 'Negative index');
	equal(cint.index(str, 16), 'b', 'Out of bounds index');
});

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


// object
test('keyValue', function() {
  deepEqual(cint.keyValue('a',1), {a:1}, 'Creates a key-value pair.')
  notEqual(cint.keyValue('a',1), cint.keyValue('a',1), 'Creates a new object instance each time.')
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
  var increment = function(n) { return n+1; }
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


// string
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

test('bookend', function() {
	equal(cint.bookend('b', 'a', 'c'), 'abc', 'Add a string to the beginning and a string to the end of a string.')
	equal(cint.bookend('b', 'a'), 'aba', 'Wrap a string with another string')
	equal(cint.bookend('b'), 'b', 'Ignores falsey begin and end values')
})

// utility
test('addTwo', function() {
	equal(cint.addTwo(4,5), 9, 'Add two numbers.')
})

test('add', function() {
	equal(cint.add(), 0, 'No arguments returns 0')
	equal(cint.add(1), 1, '1 argument returns the argument')
	equal(cint.add(1,2), 3, '2 arguments are added')
	equal(cint.add(1,2,3), 6, 'More than 2 arguments are added')
})

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

