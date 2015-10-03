/**
 * Komunalne.js - Javascript utils compilation.
 * Object definition.
 */
function Komunalne() {};
Komunalne.helper = {};
Komunalne.util = {};
Komunalne.format = {};
Komunalne.test = {};

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
 * Java-like Iterator implementation for arrays.
 */
Komunalne.helper.Iterator = function(array) {
  this.i = 0;
  this.ref = array;
};
Komunalne.helper.Iterator.prototype.hasNext = function() { return this.i < this.ref.length; };
Komunalne.helper.Iterator.prototype.next = function() {
  if (!this.hasNext()) throw "Iterator index out of bounds: " + this.i;
  return this.ref[this.i++];
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

/**
 * Suite of testcases.
 */
Komunalne.test.Suite = function(cases) { 
  this.cases = cases != undefined ? cases : [];
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
Komunalne.test.execute = function(cases,method,test) {
  var testcase;
  var args;
  var iterator;
  
  cases = cases instanceof Komunalne.test.Suite ? cases : 
          new Komunalne.test.Suite(cases instanceof Komunalne.test.Case ? [cases] : cases);
  method = typeof method == "function" ? new Komunalne.helper.Method(method) : method;
  test = typeof test == "function" ? new Komunalne.helper.Method(test) : test;
  iterator = cases.iterator();
  
  while (iterator.hasNext()) {
    testcase = iterator.next();
    args = [];
    args.push(method.apply(testcase.args));
    if (testcase.hasExpected()) args.push(testcase.expected);
    if (testcase.hasMsg()) args.push(testcase.msg);
    test.apply(args);
  }
};
