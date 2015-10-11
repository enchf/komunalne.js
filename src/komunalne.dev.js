/**
 * Komunalne.js - Javascript utils compilation.
 * Object definition.
 */
function Komunalne() {};
Komunalne.helper = {};
Komunalne.util = {};
Komunalne.format = {};
Komunalne.test = {};

/* Shortcut if not defined already */
if (window.K === undefined) window.K = Komunalne;

/**
 * Executor function wrapper, with optional predefined scope.
 * @param method Method to be executed.
 * @param scope (optional) Method scope.
 */
Komunalne.helper.Method = function(method,scope) {
  this.fn = method;
  this.scope = scope != undefined ? scope : null;
};

/**
 * The native apply JS method for the array passed as argument.
 */
Komunalne.helper.Method.prototype.apply = function(args) { return this.fn.apply(this.scope,args); };

/**
 * The native call JS method for the passed arguments.
 */
Komunalne.helper.Method.prototype.call = function() { return this.fn.apply(this.scope,arguments); };

/**
 * Java-like Iterator implementation for arrays and objects.
 */
Komunalne.helper.Iterator = function(object) {
  this.keys = [];
  this.i = 0;
  this.ref = (object || []);
  for (var x in object) this.keys.push(x);
};

/* Statics */
Komunalne.helper.Iterator.keyError = "Iterator has not started to retrieve elements";
Komunalne.helper.Iterator.nextError = "Iterator index out of bounds: ";

/* Iterator prototype */

/**
 * True if there are more elements to iterate.
 */
Komunalne.helper.Iterator.prototype.hasNext = function() { return this.i < this.keys.length; };

/**
 * Returns the next element in the iteration.
 */
Komunalne.helper.Iterator.prototype.next = function() {
  if (!this.hasNext()) throw Komunalne.helper.Iterator.nextError + this.i;
  return this.ref[this.keys[this.i++]];
};

/**
 * Determines the iteration length.
 */
Komunalne.helper.Iterator.prototype.length = function() { return this.keys.length; };

/**
 * Determines the number of remaining elements in the iteration.
 */
Komunalne.helper.Iterator.prototype.remaining = function() { return this.length() - this.i; };

/**
 * Returns the key (numeric in case of an array/arguments, the key in case of an object) of the last returned element.
 */
Komunalne.helper.Iterator.prototype.currentKey = function() { 
  if (this.i === 0) throw Komunalne.helper.Iterator.keyError;
  return this.keys[this.i - 1];
};

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

/**
 * For each method that works both on objects or array/arguments.
 * The method passes the arguments to the callback function in the same way as native Array.forEach does:
 * - value: The value element.
 * - key: Index for arrays and key for objects.
 * - object: The iterated array or object.
 */
Komunalne.util.forEach = function(obj,fn,scope) {
  var i;
  if (Komunalne.util.isArray(obj)) obj.forEach(fn,scope);
  else {
    i = new Komunalne.helper.Iterator(obj);
    while (i.hasNext()) fn.call(scope,i.next(),i.currentKey(),obj);
  }
};

/**
 * Formats a number as a currency.
 * @param num Number object. Mandatory to be a number or a parseable number.
 * @param nd (optional) Number of decimals, default to 2.
 * @param ds (optional) Decimal separator, default to '.'.
 * @param ms (optional) Milliard separator, default to ','.
 */
Komunalne.format.currency = function(num,nd,ds,ms){
  if (!(typeof num == "number")) throw "Formatting a non-number";
  nd = nd !== "" && nd !== null && !isNaN((nd = Math.abs(nd))) ? nd : 2;
  ds = ds != undefined ? ds : ".";
  ms = ms != undefined ? ms : ",";
  var neg = num < 0 ? "-" : "";
  var fix = num.toFixed(nd);
  var ist = Math.abs(parseInt(fix)).toString();
  var dec = Math.abs(fix).toString().substr(ist.length+1,nd);
  dec = (dec.length < nd) ? dec + ((new Array(nd-dec.length+1)).join("0")) : dec;
  var res = "";
  var i = ist.length;
  for (; (i-3)>0; i-=3) res = (ms+ist.substr(i-3,3)) + res;
  res=neg + ist.substring(0,i) + res;
  return res + (dec.length > 0 ? (ds+dec) : "");
};

/**
 * Creates a capitalized string setting the first letter uppercase and the rest to lowercase.
 * @param str String to be capitalized.
 */
Komunalne.format.capitalize = function(str) { return str[0].toUpperCase() + str.substr(1).toLowerCase(); };

/**
 * Test case object build with a config object with the following properties (all optional):
 * - expected Expected return value. Mandatory as it is the comparison value.
 * - args Arguments to be passed to the target function, if any. Mandatory to be an array.
 * - msg Test case message.
 */
Komunalne.test.Case = function(config) {
  config = config || {};
  this.expected = config.expected;
  this.args = config.args;
  this.msg = config.msg;
};

/**
 * Test case execution of the expected value against (if any, if args) a method using a verification test.
 * Both arguments need to be functions or instances of K.helper.Method.
 * @param verifier Verifier method, usually constructed from QUnit.assert.buildFor K.js add-on.
 * @param method (optional) Optional method execution, valid if and only if args property is set.
 */
Komunalne.test.Case.prototype.execute = function(verifier,method) {
  var vargs = [];
  verifier = Komunalne.util.isFunction(verifier) ? new Komunalne.helper.Method(verifier) : verifier;
  method = Komunalne.util.isFunction(method) ? new Komunalne.helper.Method(method) : method;
  if (this.expected) vargs.push(this.expected);
  if (method && this.args) vargs.push(method.apply(this.args));
  if (this.msg) vargs.push(this.msg);
  verifier.apply(vargs);
};

/**
 * Suite of testcases.
 */
Komunalne.test.Suite = function(cases) { 
  this.cases = cases == undefined ? [] :
    Komunalne.util.isArray(cases) ? cases :
    cases instanceof Komunalne.test.Case ? [cases] : [];
};
Komunalne.test.Suite.prototype.size = function() { return this.cases.length; };
Komunalne.test.Suite.prototype.iterator = function() { return new Komunalne.helper.Iterator(this.cases); };
Komunalne.test.Suite.prototype.add = function(ex,args,msg) { 
  this.cases.push(new Komunalne.test.Case(ex,args,msg));
};
Komunalne.test.Suite.prototype.clear = function() { this.cases = []; };

/**
 * Execute a set of test cases.
 * @param verifier Verifier method, function or instance of K.helper.Method.
 * @param method (optional) Method to be executed against the expected value, function or instance of K.helper.Method.
 */
Komunalne.test.Suite.prototype.execute = function(verifier,method) {
  var iterator = this.iterator();
  while (iterator.hasNext()) {
    iterator.next().execute(verifier,method);
  }
};

/**
 * Extending QUnit.assert to generate a K.helper.Method object.
 */
(function() {
  if (window.QUnit) { 
    QUnit.assert.buildFor = function(fn) { return new Komunalne.helper.Method(this[fn],this); };
  }
})();
