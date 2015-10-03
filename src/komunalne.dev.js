/**
 * Komunalne.js - Javascript utils compilation.
 */
function Komunalne() {};
Komunalne.test = {};
Komunalne.format = {};

/**
 * Execute a set of test cases.
 * @param cases An array of test cases. Each element is an object that can have the following properties:
 *   - args (mandatory): The arguments to be passed to the method to be tested. Mandatory.
 *   - expected (optional): If the test function need a comparison object.
 *   - msg (optional): Custom message for the unit test execution.
 *   These arguments are passed in the same order as they are listed to the test method (if they are present).
 * @param method Any of a function or an object with the definition of the method to be tested.
 *   If an object is passed as argument, contains 2 properties:
 *   - fn: The method to be tested.
 *   - scope (optional): Method execution scope, if needed.
 * @param test An object with the definition of the testing method. 
 *   This object should have the same properties as method argument.
 *   When using QUnit.assert object methods, assert object itself should be passed as scope.
 */
Komunalne.test.execute = function(cases,method,test) {
  var testcase;
  var args;
  var result;
  var mf,ms,tf,ts;
  for (var i in cases) {
    testcase = cases[i];
    args = [];
    mf = typeof method == "function" ? method : method.fn;
    ms = typeof method == "function" ? null : (method.scope != undefined ? method.scope : null);
    tf = typeof test == "function" ? test : test.fn;
    ts = typeof test == "function" ? null : (test.scope != undefined ? test.scope : null);
    result = mf.apply(ms, testcase.args);
    
    args.push(result);
    if (testcase.expected != undefined) args.push(testcase.expected);
    if (testcase.msg != undefined) args.push(testcase.msg);
    
    tf.apply(ts, args);
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
