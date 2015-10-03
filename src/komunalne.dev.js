/**
 * Komunalne.js - Javascript utils compilation.
 */
function Komunalne() {};
Komunalne.helper = {};
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
