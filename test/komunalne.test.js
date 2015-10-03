/**
 * Komunalne.js tests definition.
 */
QUnit.test("Komunalne.js Definition", function(assert) {
  assert.ok(Komunalne,"Komunalne.js object defined");
  assert.ok(Komunalne.format,"Komunalne.js formatters container defined");
  assert.ok(Komunalne.test,"Komunalne.js unit testing helpers");
});

QUnit.test("Komunalne.js unit test executor", function(assert) {
  var cases = [];
  var i = 1;
  
  cases.push({ "args": ["Fake",1] });
  cases.push({ "args": ["Fake",2], "expected": 2 });
  cases.push({ "args": ["Fake",3], "expected": 3, "msg": "Message" });
  
  Komunalne.test.execute(cases, function(name,i) { return i; }, { "fn": function(a,b,c) {
    assert.equal(a,arguments.length,"Testing arguments number for object " + i);
    assert.equal(i,a,"Testing execution order " + (i++));
  }});
  
  var ignoreOnlyNullOrUndefined = [{ "args": [], "expected": "", "msg": "Call to append without arguments" }];
  var funct = function(a,b,c) { 
    assert.equal(arguments.length, 3, "Preventing to avoid skip false-able values ('',false,...)");
    assert.deepEqual(a,"","Check to prevent skipping empty strings");
    assert.equal(b,"","Check to prevent skipping empty strings");
    assert.equal(c,ignoreOnlyNullOrUndefined[0].msg,"Check for third argument");
  };
  Komunalne.test.execute(ignoreOnlyNullOrUndefined, function() { return ""; }, funct);
});

QUnit.test("Komunalne.js currency formatter", function(assert) {
  var cases = [];
  
  // Testing Integers.
  cases.push({ "args": [1], "expected": "1.00", "msg": "Testing integer" });
  cases.push({ "args": [0], "expected": "0.00", "msg": "Testing integer with 0" });
  cases.push({ "args": [666], "expected": "666.00", "msg": "Testing integer with 3 digits" });
  cases.push({ "args": [1010], "expected": "1,010.00", "msg": "Testing integer greater than 1000" });
  cases.push({ "args": [123456789012], "expected": "123,456,789,012.00", "msg": "Testing big integer" });
  cases.push({ "args": [12345], "expected": "12,345.00", "msg": "Testing integer with 5 digits" });
  cases.push({ "args": [-0], "expected": "0.00", "msg": "Testing -0" });
  cases.push({ "args": [-1], "expected": "-1.00", "msg": "Testing negative digit" });
  cases.push({ "args": [-123], "expected": "-123.00", "msg": "Testing negative with 3 digits" });
  cases.push({ "args": [-12345], "expected": "-12,345.00", "msg": "Testing negative with 5 digits" });
  cases.push({ "args": [-123456789012], "expected": "-123,456,789,012.00", "msg": "Testing big negative" });
  
  // Testing floats.
  cases.push({ "args": [1.23], "expected": "1.23", "msg": "Testing float" });
  cases.push({ "args": [0.01], "expected": "0.01", "msg": "Testing float between 0 and 1" });
  cases.push({ "args": [-12.34], "expected": "-12.34", "msg": "Testing negative float" });
  cases.push({ "args": [-12345678.901234], "expected": "-12,345,678.90", "msg": "Testing big negative float" });
  cases.push({ "args": [1.235], "expected": "1.24", "msg": "Testing rounding up" });
  cases.push({ "args": [1.234], "expected": "1.23", "msg": "Testing rounding down" });
  cases.push({ "args": [1.2], "expected": "1.20", "msg": "Testing padding zeros" });
  cases.push({ "args": [1.999], "expected": "2.00", "msg": "Testing complex rounding up" });
  cases.push({ "args": [-1.999], "expected": "-2.00", "msg": "Testing negative complex round" });
  
  // Testing formatter changing default parameters.
  cases.push({ "args": [1.234444,3], "expected": "1.234", "msg": "Testing 3 decimals round down" });
  cases.push({ "args": [1.234567,4], "expected": "1.2346", "msg": "Testing 4 decimals round up" });
  cases.push({ "args": [0.000001,3], "expected": "0.000", "msg": "Testing round down to 0" });
  cases.push({ "args": [1.2,6], "expected": "1.200000", "msg": "Testing padding zeros" });
  cases.push({ "args": [1.20019001,4], "expected": "1.2002", "msg": "Testing 4 decimals round up" });
  cases.push({ "args": [1.23,3,"@"], "expected": "1@230", "msg": "Testing changing decimal separator" });
  cases.push({ "args": [12345.567,2,"-","="], "expected": "12=345-57", 
               "msg": "Testing changing both decimal and thousands separators" });
  cases.push({ "args": [12345.6543,2,"$%&","--"], "expected": "12--345$%&65", 
               "msg": "Lenght > 1 separators" });
  
  Komunalne.test.execute(cases, Komunalne.format.currency, { fn: assert.equal, scope: assert });
});