QUnit.module('cint');

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

test('partialAt', function() {
	var subtract = function(x,y) { return x - y; };
	var subtractFromTen = cint.partialAt(subtract, 0, [10]);
	equal(subtractFromTen(1), 9, 'Inject arguments at the beginning.');

	var subtractTen = cint.partialAt(subtract, 1, [10]);
	equal(subtractTen(100), 90, 'Inject arguments in the middle.');

	var subtractTwenty = cint.partialAt(subtract, -1, [20])
	equal(subtractTwenty(100), 80, 'Handles negative indexes');
});

test('arritize', function() {
	var joinEm = function() { 
		var givenArgs = Array.prototype.slice.call(arguments, 0);
		return givenArgs.join('');
	};
	var joinTwo = cint.arritize(joinEm, 2);
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

// array
test('spliced', function() {
	var arr = [1,2,3,4,5];
	deepEqual(cint.spliced(arr, 2, 1, 100, 200, 300), [1,2,100,200,300,4,5]);
	deepEqual(arr, [1,2,3,4,5], 'Original array is unchanged.');
});

