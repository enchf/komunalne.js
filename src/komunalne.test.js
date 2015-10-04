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
