/**
 * Generates a new string object from concatenating 'app' (appended) string (if present)
 * to 'str' string (if present), being separated by 'sep' (separator) string (if present, otherwise ' ').
 * The result is trimmed.
 * @param str First place string, optional, default = ''.
 * @param app Second place string, optional, default = ''.
 * @param sep Above strings separator, optional, default = ' '.
 */
Komunalne.util.append = function(str,app,sep) { 
  return ((str||"") + (sep||" ") + (app||"")).trim();
};

/**
 * Lookup in obj for the dot-separated path element.
 * If at some point the current reference is null, the result is null.
 * Pass an empty string as 'path' argument to return 'obj' itself.
 * @param obj The object to lookup.
 * @param path Dot-separated path reference ("a.b.c...")
 */
Komunalne.util.path = function(obj,path) {
  if (path === "") return obj;
  var paths = path.split(".");
  var el = obj;
  for (var p in paths) {
    if (typeof el === "object" && el[paths[p]] !== undefined) el = el[paths[p]]; 
    else { el = null; break; }
  }
  return el;
};

/**
 * Returns true if the object passed as argument is a Date.
 * If strict mode is set to true, returns true only if the Date object is valid.
 * @param date Object to be validated as date.
 * @param strict True to check the date validity, false to only check the type.
 */
Komunalne.util.isDate = function(date,strict) { 
  return (date instanceof Date) && (!strict || !isNaN(date.valueOf())); 
};

/**
 * Returns true if the argument is a function.
 * @param obj Object to be validated as function.
 */
Komunalne.util.isFunction = function(obj) { return typeof obj == "function"; };

/**
 * Returns true if the object is iterable in a 'for (var x in obj) {}' statement.
 * @param obj Object to be validated as iterable.
 */
Komunalne.util.isIterable = function(obj) { 
  return typeof obj == "object" && obj != undefined && !Komunalne.util.isDate(obj);
};

/**
 * Returns true if the object is an Array.
 * @param obj Object to be validated as an array.
 */
Komunalne.util.isArray = function(obj) { 
  return Komunalne.util.isIterable(obj) && obj.constructor && obj.constructor == Array; 
};

/**
 * Checks an object against a specific type.
 * Scenarios:
 * - Param 'type' is string: Compares 'obj' as primitive using typeof against 'type'.
 * - Param 'type' is a function: Uses instanceof operator whatever type is 'obj'.
 * - Otherwise: Throws exception.
 */
Komunalne.util.isInstanceOf = function(obj,type) {
  var res;
  if (typeof type == "string") res = (typeof obj == type);
  else if (Komunalne.util.isFunction(type)) res = obj instanceof type;
  else throw "Invalid comparison of " + (typeof obj) + " against " + (typeof type);
  return res;
};

/**
 * Test whether an array is completely filled with objects of the specified type.
 * Type can be a primitive name (string) or a function object.
 */
Komunalne.util.isArrayOf = function(obj,type) {
  var is = Komunalne.util.isArray(obj);
  var i = new Komunalne.helper.Iterator(obj,type);
  while (is && i.hasNext()) is = Komunalne.util.isInstanceOf(i.next(),type);
  return is;
};

/**
 * Checks if both arguments are of the same class.
 */
Komunalne.util.areSameClass = function(a,b) {
  return (typeof a) == (typeof b) && ((typeof a == "object") ? a.constructor === b.constructor : true);
};

/**
 * Do a deep equality test on the arguments.
 * The arguments should be equals in type, constructor (if they are objects), and:
 * - If they are objects, the same keys in the same defined order.
 * - If they are arrays, the same elements in the same position.
 */
Komunalne.util.deepEquals = function(a,b) {
  var ai,bi,ait,bit,an,bn;
  var equal = true;
  ai = Komunalne.util.isIterable(a);
  bi = Komunalne.util.isIterable(b);
  
  if (ai && bi && (equal = Komunalne.util.areSameClass(a,b))) {
    ait = new Komunalne.helper.Iterator(a);
    bit = new Komunalne.helper.Iterator(b);
    equal = ait.length() == bit.length();
    
    while (ait.hasNext() && equal) {
      an = ait.next();
      bn = bit.next();
      equal = Komunalne.util.deepEquals(an,bn);
      equal = equal && ait.currentKey() == bit.currentKey();
    }
  } else equal = (ai == bi && a === b);
  
  return equal;
};

/**
 * True if the first argument is contained in the second argument array.
 * @param item Lookup item into the array.
 * @param array Array to be inspected.
 * @param deep True to use a deep equals comparing item with array elements.
 */
Komunalne.util.arrayContains = function(item,array,deep) {
  var it,found;
  if (deep === true) {
    it = new Komunalne.helper.Iterator(array);
    found = false;
    while (it.hasNext() && !found) found = Komunalne.util.deepEquals(item,it.next());
  } else found = array.indexOf(item) >= 0;
  return found;
};

/**
 * Check if any of the arguments passed correspond to the first one.
 * Sample: Komunalne.util.isAnyOf(1,5,3,1,2,4) will return true as 1 is part of [5,3,1,2,4].
 */
Komunalne.util.isAnyOf = function(item) {
  return Komunalne.util.arrayContains(item,Array.prototype.slice.call(arguments,1));
};

/**
 * Concatenate the arrays passed as arguments into a new array object.
 */
Komunalne.util.arrayConcat = function() {
  var arr = [];
  var i = new Komunalne.helper.Iterator(arguments);
  while (i.hasNext()) arr = arr.concat(i.next());
  return arr;
};