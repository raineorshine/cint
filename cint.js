/***********************************
 * String
 ***********************************/

/**
 * Performs variable substitution on the string, replacing items in {curly braces}.
 *
 * Same as Lodash's _.template(str, o, { interpolate: /{([\s\S]+?)}/g }).
 *
 * Based on supplant by Douglas Crockford http://javascript.crockford.com/remedial.html
 *
 * @param str
 * @param o
 */
export const supplant = (str, o) =>
  str.replace(/{([^{}]*)}/g,
    (a, b) => b in o ? o[b] : a
  )

/**
 * Returns true if the string starts with the given substring. Returns false if the substring is the empty string.
 *
 * @param str
 * @param sub The substring.
 */
export const startsWith = (str, sub) =>
  str.indexOf(sub) === 0 && sub !== ''

/**
 * Returns the substring before the first instance of the given delimiter.
 *
 * @param str
 * @param delim
 */
export const before = (str, delim) =>
  str.split(delim)[0]

/**
 * Returns the substring after the first instance of the given delimiter. Returns the whole string if the delimiter is not found.
 *
 * @param str
 * @param delim
 */
export const after = (str, delim) => {
  const delimIndex = str.indexOf(delim)
  return delimIndex >= 0 ?
    str.substring(delimIndex + delim.length) : str
}

/**
 * Returns the substring between the given delimiters.
 *
 * @param str
 * @param left
 * @param right
 */
export const between = (str, left, right) =>
  before(after(str, left), right)

/**
 * Wraps a string with a left and right. If right omitted, wraps both ends in left.
 *
 * @param middle
 * @param left
 * @param right
 */
export const bookend = (middle, left, right) =>
  (left || '') + middle + (right || left || '')

/**
 * Returns a single string that repeats the string n times. Optionally joins it with the given delimeter
 *
 * @param str
 * @param n
 * @param delim Default: ''
 */
export const repeatString = (str, n, delim) => {
  delim = delim || ''
  return mapNumber(n, () => str).join(delim)
}

/**
 * Capitalizes the first letter of each word in the given string.
 *
 * @param str
 */
export const toTitleCase = str => {
  const capitalizeFirst = s =>
    s.length ? s[0].toUpperCase() + s.substring(1).toLowerCase() : ''
  return str.split(' ').map(capitalizeFirst).join(' ')
}

/***********************************
 * Number
 ***********************************/

/**
 * Returns the ordinal value (like '1st' or '2nd') of the given integer.
 *
 * @param n
 */
export const ordinal = n => {
  const lastDigit = n % 10
  return n + (
    n >= 11 && n <= 13 ? 'th' :
    lastDigit === 1 ? 'st' :
    lastDigit === 2 ? 'nd' :
    lastDigit === 3 ? 'rd' :
    'th')
}

/**
 * Invokes the given export const n times = , passing the index for each invocation, and returns an array of the results=> .
 *
 * @param n
 * @param f
 */
export const mapNumber = (n, f) => {
  const results = []
  for (let i = 0; i < n; i++) {
    results.push(f(i))
  }
  return results
}

/** Adds two numbers. */
export const addTwo = (x, y) => x + y

/** Adds all given arguments. */
export const add = (...args) =>
  args.length ? args.reduce(addTwo) : 0

/***********************************
 * Array
 ***********************************/

/**
 * Group the array of objects by one of the object's properties or mappable function. Returns an array of { key: ___, items: ___ } objects which represent all the items in the original array grouped by the value of the specified grouping key.
 *
 * @param arr
 * @param propOrFunc
 */
export const orderedGroup = (arr, propOrFunc) => {

  if (!propOrFunc) {
    throw new Error('You must specific a property name or mappable function.')
  }

  const getGroupKey = typeof propOrFunc === 'function'
    ? propOrFunc
    : item => item[propOrFunc]

  const results = []
  const dict = {}
  const len = arr.length
  for (let i = 0; i < len; i++) {
    const key = getGroupKey(arr[i])
    if (!(key in dict)) {
      dict[key] = []
      results.push({ key: key, items: dict[key] })
    }
    dict[key].push(arr[i])
  }

  return results
}

/**
 * Returns a dictionary whose keys are the values of the array and values are the number of instances of that value within the array.
 *
 * @param arr
 */
export const tally = arr => {
  const dict = {}
  const len = arr.length
  for (let i = 0; i < len; i++) {
    const count = dict[arr[i]] || 0
    dict[arr[i]] = count + 1
  }
  return dict
}

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
export const tallyProps = arr => {

  const tallies = {}

  for (let i = 0; i < arr.length; i++) {

    const o = arr[i]

    // loop through each property so the value can be tallied in the tallies object
    for (const key in o) {

      // cache the value
      const value = o[key]

      // create a new tally object if it doesn't exist for this value
      if (!tallies[value]) {
        tallies[value] = {}
      }

      // increment the count
      tallies[value][key] = (tallies[value][key] || 0) + 1
    }
  }

  return tallies
}

/**
 * Returns the in-bounds index of the given index for the array, supports negative and out-of-bounds indices.
 *
 * @private
 * @param arr
 * @param i
 */
export const circ = (arr, i) => {

  // return first index if i is null or undefined
  if (i === undefined || i === null) return arr[0]

  // one modulus to get in range, another to eliminate negative
  return (i % arr.length + arr.length) % arr.length
}

/**
 * Indexes into an array, supports negative indices.
 *
 * @param arr
 * @param n
 */
export const index = (arr, i) => arr[circ(arr, i)]

/**
 * Returns a new array containing the elements of the given array shifted n spaces to the left, wrapping around the end.
 *
 * @param arr
 * @param n
 */
export const rotate = (arr, n) => {
  const output = []
  const len = arr.length
  for (let i = 0; i < len; i++) {
    output.push(index(arr, i + n))
  }
  return output
}

/**
 * Creates an object with a property for each element of the given array, determined by a function that returns the property as a { key: value }=> .
 *
 * @param arr
 * @param f
 */
export const toObject = (arr, f) => {
  const keyValues = []
  const len = arr.length
  for (let i = 0; i < len; i++) {
    keyValues.push(f(arr[i], i))
  }
  return merge.apply(arr, keyValues)
}

/**
 * Functional, nondestructive version of Array.prototype.splice.
 *
 * @param arr
 * @param index
 * @param howMany
 * @param elements
 */
export const spliced = (arr, index, howMany, ...elements) => {
  const elementsLen = elements.length
  const results = []
  const len = arr.length

  // add starting elements
  for (let i = 0; i < index && i < len; i++) {
    results.push(arr[i])
  }

  // add inserted elements
  for (let i = 0; i < elementsLen; i++) {
    results.push(elements[i])
  }

  // add ending elements
  for (let i = index + howMany; i < len; i++) {
    results.push(arr[i])
  }

  return results
}

/**
 * Breaks up the array into n evenly-sized chunks.
 *
 * Solution from http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
 *
 * @param arr
 * @param n
 */
export const chunk = (a, n) => {
  const len = a.length; const out = []; let i = 0
  while (i < len) {
    const size = Math.ceil((len - i) / n--)
    out.push(a.slice(i, i += size))
  }
  return out
}

/***********************************
 * Object
 ***********************************/

/**
 * Returns a new object with the given key and value.
 *
 * @param key
 * @param value
 */
export const keyValue = (key, value) => {
  const o = {}
  o[key] = value
  return o
}

/** Gets the value of a key of the given object.
 */
export const getValue = (o, key) => o[key]

/** Sets the value of the given key and returns the object.
 */
export const setValue = (o, key, value) => {
  o[key] = value
  return o
}

/** Creates a mapping function that applies the given function to the value of the specified key=> .
 */
export const mapOverKey = (f, originalKey, newKey) =>
  o => setValue(o, newKey || originalKey, f(o[originalKey]))

/**
 * Join the object into a single string with the given separators separating properties from each other as well as values.
 *
 * @param obj
 * @param propSeparator
 * @param valueSeparator
 */
export const joinObject = (obj, propSeparator, valueSeparator) => {
  const keyValuePairs = []
  for (const prop in obj) {
    keyValuePairs.push(prop + valueSeparator + obj[prop])
  }
  return keyValuePairs.join(propSeparator)
}

/**
 * Returns a new object with the given objects merged onto it. Non-undefined properties on later arguments override identical properties on earlier arguments.
 *
 * @param objects
 */
export const merge = (...args) => {

  const mothership = {}

  // iterate through each given object
  const len = args.length
  for (let i = 0; i < len; i++) {
    const outlier = args[i]

    // add each property to the mothership
    for (const prop in outlier) {
      if (typeOf(outlier[prop]) === 'object' && outlier[prop].constructor === Object && outlier[prop] !== null && !(outlier[prop] instanceof Array)) {
        mothership[prop] = merge(mothership[prop], outlier[prop]) // RECURSION
      }
      else if (outlier[prop] !== undefined) {
        mothership[prop] = outlier[prop]
      }
    }
  }

  return mothership
}

/**
 * Returns an array whose items are the result of calling f(key, value) on each property of the given object. If f is undefined, returns a list of { key: ___, value: ___ } objects.
 *
 * @param obj
 * @param f
 */
export const toArray = (obj, f) => {
  f = f || ((key, value) => ({ key: key, value: value }))
  const result = []
  for (const key in obj) {
    result.push(f(key, obj[key]))
  }
  return result
}

/**
 * Returns a new object that only includes the properties of the given obj for which f(key, value) is true.
 *
 * @param obj
 * @param f
 */
export const filterObject = (obj, f) => {
  const result = {}
  for (const key in obj) {
    if (f(key, obj[key])) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Changes the specified keys in an object.
 *
 * @param obj
 * @param changeKeys
 * @example cint.changeKeys(
 * { fname: 'Raine', lname: 'Lourie', specialty: 'Javascript' },
 * { fname: 'first', lname: 'last' }
 * )
 */
export const changeKeys = (obj, changedKeys) => {
  const result = {}
  for (const key in obj) {
    result[key in changedKeys ? changedKeys[key] : key] = obj[key]
  }
  return result
}

/** Calls a function on an object and returns the object (for chaining purposes)=> .
 */
export const tap = (f, o) => {
  f(o)
  return o
}

/* console.log's the given object and returns the object (for chaining purposes).
*/
export const look = o => {
  console.log(o)
  return o
}

/***********************************
 * Function
 ***********************************/

/**
 * Returns a function that returns the inverse of the given boolean function=> .
 *
 * @param f The function to inverse=> .
 */
export const not = f => (...args) => !f(...args)

/**
 * Returns a new function that inserts the given curried arguments to the inner function at the specified index of its runtime arguments=> .
 *
 * @example _.partial(f, args...) is equivalent to cint.partialAt(f, 0, args) and _.partialRight(f, args...) is equivalent to cint.partialAt(f, n, args) where n is the arity of the function.
 * @param f
 * @param index
 * @param curriedArgs
 */
export const partialAt = (f, index, curriedArgs) => (...args) => {

  // handle negative indices
  // Note that we add 1 so that -1 points to the slot AFTER the last element, not before the last element (which is what the last index points to).
  if (index < 0) {
    index = circ(args, index) + 1
  }

  const spliceArgs = [args, index, 0].concat(curriedArgs)
  const newArgs = spliced.apply(this, spliceArgs)
  return f.apply(this, newArgs)
}

/**
 * Returns a new function that calls the function with a limit on the number of arguments.
 *
 * @param f
 * @param n
 */
export const aritize = (f, n) => (...args) => f(...args.slice(0, n))

/** Recursively invokes the given function with no parameters until it returns a non-functional value=> .
 *
  @param value
 */
export const callTillValue = value =>
  typeof value === 'function' ? callTillValue(value()) : value

/**
 * Returns a function that calls the given function as normal, then passes its inputs and output to the spier (defaults to console.log=> )
 *
 * @param f
 * @param [spier=console.log]
 */
export const spy = (f, spier) => {
  const that = this
  spier = spier || console.log.bind(console)

  return (...args) => {
    const out = f.apply(that, args)
    spier.call(that, f, args, out)
    return out
  }
}

/** Converts the given synchronous function into an asynchronous function that applies its arguments to the original function and invokes callback(error, result)=> .
 *
      @param f
 */
export const toAsync = f =>
  (...args) => {
    const that = this
    const callback = index(args, -1)
    setTimeout(() => {
      try {
        const result = f.apply(that, args)
        callback(null, result)
      }
      catch (e) {
        callback(e)
      }
    }, 0)
  }

/***********************************
 * Utility
 ***********************************/

/** Compares two items lexigraphically.  Returns 1 if a>b, 0 if a==b, or -1 if a<b.
 *
  @param a
  @param b
 */
export const compare = (a, b) =>
  a > b ? 1 :
  a < b ? -1 :
  0

/**
 * Compares the value of the given property between two objects.
 *
 * @param property
 */
export const compareProperty = (property, a, b) =>
  compare(a[property], b[property])

/**
 * Create a new instance of the given constructor with the given constructor arguments. Useful for higher order programmer where the new keyword won't work.
 *
 * @param C Constructor
 * @param args
 */
export const createNew = (C, args) => new C(...args)

/**
 * Returns a compare function that can be passed to Array.sort to sort in the order of the given array of properties. A property can also be appended with ' ASC' or ' DESC' to control the sort order=> .
 *
 * @param props
 */
export const dynamicCompare = props => {

  if (!props || !(props instanceof Array)) {
    throw new Error('props is falsey or not an Array')
  }

  return function(a, b) {
    const len = props.length
    for (let i = 0; i < len; i++) {
      let aVal, bVal, sortDir
      if (typeof props[i] === 'function') {
        aVal = props[i](a)
        bVal = props[i](b)
        sortDir = 'asc'
      }

      else if (props[i].toLowerCase().indexOf(' ') >= 0) {
        const splitVal = props[i].split(' ')
        aVal = a[splitVal[0]]
        bVal = b[splitVal[0]]
        sortDir = splitVal[1].toLowerCase()
      }
      else {
        aVal = a[props[i]]
        bVal = b[props[i]]
        sortDir = 'asc'
      }

      // this is important so that if the values are equal, it continues to the next sort property
      if (aVal !== bVal) {
        return sortDir === 'asc' ? compare(aVal, bVal) : compare(bVal, aVal)
      }
    }
    return 0
  }
}

/** Returns true if all the items in a are equal to all the items in b, recursively.
 *
  @param a
  @param b
 */
export const equals = (a, b) => {

  if (typeof a !== typeof b) {
    return false
  }

  // compare arrays
  if (a instanceof Array) {

    // check if the arrays are the same length
    if (a.length !== b.length) {
      return false
    }

    // check the equality of each item
    for (let i = 0, l = a.length; i < l; i++) {
      if (!b || !b[i] || !equals(a[i], b[i])) { // RECURSION
        return false
      }
    }
  }
  // compare primitives
  else if (typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean' || typeof a === 'undefined') {
    if (a !== b) {
      return false
    }
  }
  // compare objects
  else if (Object.keys(a).length === Object.keys(b)) {
    for (const property in a) {
      if (!(property in b && b[property] === a[property])) {
        return false
      }
    }
  }
  else {
    return a === b
  }

  return true
}

/** Converts the given value to a string by calling its toString method.
 */
export const intoString = value => value.toString()

/** Returns true if the given value is not undefined, null, or an empty string.
 *
  @param x
 */
export const isValue = x =>
  x !== undefined && x !== null && x !== ''

/** Returns a string representation of the given scalar, array, or dictionary.
 *
  @param o
 */
export const hash = o => {
  if (o === undefined) {
    return 'undefined'
  }
  else if (o === null) {
    return 'null'
  }
  else if (typeof o === 'string' || typeof o === 'number') {
    return '' + o
  }
  else if (typeOf(o) === 'array') {
    return '_[{0}]_'.format(o.map(hash).join(','))
  }
  else if (typeOf(o) === 'object') {
    let objString = ''
    for (const prop in o) {
      objString += supplant('{0}_:_{1}', [prop, hash(o[prop])])
    }
    // escape for handlebars
    return supplant('_\{{0}}_', [objString]) // eslint-disable-line no-useless-escape
  }
  else {
    throw new Error('Unhashable value: ' + o)
  }
}

/** Generates a pseudo-random string that can be assumed to be unique. */
const guid = (function() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return () => S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
})()

/** Returns a string representing the type of the object, with special handling for null and arrays.
 *
  @author  Douglas Crockford http://javascript.crockford.com/remedial.html
  @param value
 */
export const typeOf = value => {
  let s = typeof value
  if (s === 'object') {
    if (value) {
      if (typeof value.length === 'number' &&
          !value.propertyIsEnumerable('length') && // eslint-disable-line no-prototype-builtins
          typeof value.splice === 'function') {
        s = 'array'
      }
    }
    else {
      s = 'null'
    }
  }
  return s
}

/***********************************
 * Export Public Interface
   ***********************************/

export default {

  // string
  supplant,
  startsWith,
  before,
  after,
  between,
  bookend,
  repeatString,
  toTitleCase,

  // number
  ordinal,
  mapNumber,
  addTwo,
  add,

  // array
  orderedGroup,
  tally,
  tallyProps,
  index,
  rotate,
  toObject,
  spliced,
  chunk,

  // object
  keyValue,
  getValue,
  setValue,
  mapOverKey,
  joinObject,
  toArray,
  filterObject,
  changeKeys,
  tap,
  look,

  // function
  not,
  partialAt,
  aritize,
  callTillValue,
  spy,
  toAsync,

  // utility
  compare,
  compareProperty,
  createNew,
  dynamicCompare,
  equals,
  intoString,
  isValue,
  hash,
  guid,
  typeOf,
}
