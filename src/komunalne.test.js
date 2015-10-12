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
  verifier = Komunalne.test.Case.transform(verifier);
  method = Komunalne.test.Case.transform(method);
  if (this.expected !== undefined) vargs.push(this.expected);
  if (method && Komunalne.util.isArray(this.args)) vargs.push(method.apply(this.args));
  if (this.msg != undefined) vargs.push(this.msg.toString());
  verifier.apply(vargs);
};

/**
 * Transforms a function into a K.helper.Method object if needed.
 */
Komunalne.test.Case.transform = function(fn) {
  return Komunalne.util.isFunction(fn) ? new Komunalne.helper.Method(fn) : fn;
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
  verifier = Komunalne.test.Case.transform(verifier);
  method = Komunalne.test.Case.transform(method);
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
