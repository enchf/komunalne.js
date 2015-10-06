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
 * Executor function.
 * @param method Method to be executed.
 * @param scope (optional) Method scope.
 */
Komunalne.helper.Method = function(method,scope) {
  this.fn = method;
  this.scope = scope != undefined ? scope : null;
};
Komunalne.helper.Method.prototype.apply = function(args) { return this.fn.apply(this.scope,args); };
Komunalne.helper.Method.prototype.call = function() { return this.fn.apply(this.scope,arguments); };

/**
 * Java-like Iterator implementation for arrays and objects.
 */
Komunalne.helper.Iterator = function(object) {
  this.keys = [];
  this.i = 0;
  this.ref = object;
  for (var x in object) this.keys.push(x);
};
Komunalne.helper.Iterator.prototype.hasNext = function() { return this.i < this.keys.length; };
Komunalne.helper.Iterator.prototype.next = function() {
  if (!this.hasNext()) throw "Iterator index out of bounds: " + this.i;
  return this.ref[this.keys[this.i++]];
};
Komunalne.helper.Iterator.prototype.length = function() { return this.keys.length; };
Komunalne.helper.Iterator.prototype.remaining = function() { return this.length() - this.i; };

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

Komunalne.util.deepEquals = function(a,b) {
  var ai,bi,ait,bit,an,bn;
  var equal = true;
  ai = Komunalne.util.isIterable(a);
  bi = Komunalne.util.isIterable(b);
  
  if (ai && bi) {
    ait = new Komunalne.helper.Iterator(a);
    bit = new Komunalne.helper.Iterator(b);
    equal = ait.length() == bit.length();
    
    while (ait.hasNext() && equal) {
      an = ait.next();
      bn = bit.next();
      equal = Komunalne.util.deepEquals(an,bn);
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
 * Test case object.
 * @param args Arguments to be passed to the target function.
 * @param expected (optional) Expected return value.
 * @param msg (optional) Test case message.
 */
Komunalne.test.Case = function(args,expected,msg) {
  this.args = args;
  this.expected = expected;
  this.msg = msg;
};
Komunalne.test.Case.prototype.hasExpected = function() { return this.expected !== undefined; };
Komunalne.test.Case.prototype.hasMsg = function() { return this.msg !== undefined; };
Komunalne.test.Case.prototype.execute = function(method,test) {
  var args = [];
  args.push(method.apply(this.args));
  if (this.hasExpected()) args.push(this.expected);
  if (this.hasMsg()) args.push(this.msg);
  test.apply(args);
};

/**
 * Suite of testcases.
 */
Komunalne.test.Suite = function(cases) { 
  this.cases = cases == undefined ? [] :
    K.util.isArray(cases) ? cases :
    cases instanceof Komunalne.test.Case ? [cases] : [];
};
Komunalne.test.Suite.prototype.size = function() { return this.cases.length; };
Komunalne.test.Suite.prototype.iterator = function() { return new Komunalne.helper.Iterator(this.cases); };
Komunalne.test.Suite.prototype.add = function(args,expected,msg) { 
  this.cases.push(new Komunalne.test.Case(args,expected,msg));
};

/**
 * Execute a set of test cases.
 * @param cases An array of Komunalne.test.Case objects or a Komunalne.test.Suite object. 
 *   The order in which attributes are passed to the test method is args > expected > msg, as they are present.
 * @param method A function or a Komunalne.test.Method object.
 * @param test A function or a Komunalne.test.Method object (in case of QUnit.assert, assert object should be the scope.
 */
Komunalne.test.Suite.prototype.execute = function(method,test) {
  var testcase;
  var args;
  var iterator;
  
  method = typeof method == "function" ? new Komunalne.helper.Method(method) : method;
  test = typeof test == "function" ? new Komunalne.helper.Method(test) : test;
  iterator = this.iterator();
  
  while (iterator.hasNext()) {
    iterator.next().execute(method,test);
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
