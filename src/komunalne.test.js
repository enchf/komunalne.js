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
