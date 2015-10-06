/**
 * Komunalne.js test data and cases definition.
 */
var testData = {
  "empty-object": {},
  "empty-array": [],
  "null": null,
  "undefined": undefined,
  "string": "string",
  "number": 1,
  "negative-number": -1,
  "zero": 0,
  "floating-point-number": 1.23,
  "true": true,
  "false": false,
  "date": new Date(),
  "invalid-date": new Date("blblblbl"),
  "function": function() {}
};

var testDataTypes = {
  "object": { "type": "object", "apply": ["empty-object","empty-array","null","date","invalid-date"] },
  "Array": { "type": Array, "apply": ["empty-array"] },
  "undefined": { "type": "undefined", "apply": ["undefined"] },
  "string": { "type": "string", "apply": ["string"] },
  "number": { "type": "number", "apply": ["number","negative-number","zero","floating-point-number"] },
  "boolean": { "type": "boolean", "apply": ["true","false"] },
  "Date": { "type": Date, "apply": ["date","invalid-date"] },
  "function": { "type": "function", "apply": ["function"] }
};

QUnit.test("Komunalne.js Definition", function(assert) {
  assert.ok(Komunalne,"Komunalne.js object defined");
  assert.ok(Komunalne.format,"Komunalne.js formatters container defined");
  assert.ok(Komunalne.test,"Komunalne.js unit testing helpers");
  assert.ok(Komunalne.helper,"Komunalne.js helpers container");
});

QUnit.test("Komunalne.js unit test executor", function(assert) {
  var suite = new Komunalne.test.Suite();
  var i = 1;
  
  suite.add(["Fake",1]);
  suite.add(["Fake",2],2);
  suite.add(["Fake",3],3,"Message");
  
  suite.execute(function(name,i) { return i; }, function(a,b,c) {
    assert.equal(a,arguments.length,"Arguments number for object " + i);
    assert.equal(i,a,"Execution order " + (i++));
  });
  
  var ignoreOnlyNullOrUndefined = new Komunalne.test.Case([],"","Call to append without arguments");
  var funct = function(a,b,c) { 
    assert.equal(arguments.length, 3, "Preventing to avoid skip false-able values ('',false,...)");
    assert.deepEqual(a,"","Check to prevent skipping empty strings");
    assert.equal(b,"","Check to prevent skipping empty strings");
    assert.equal(c,ignoreOnlyNullOrUndefined.msg,"Check for third argument");
  };
  ignoreOnlyNullOrUndefined.execute(
    new Komunalne.helper.Method(function() { return ""; }),
    new Komunalne.helper.Method(funct));
});

QUnit.test("Append util function", function(assert) {
  var suite = new Komunalne.test.Suite();
  
  suite.add([],"","Call to append without arguments");
  suite.add([""],"","Call to append with empty string");
  suite.add(["Str"],"Str","Call to append with single string");
  suite.add(["A","B"],"A B","Call to append with two strings");
  suite.add(["A","B","C"],"ACB","Call to append with three strings");
  suite.add(["A",null],"A","Append null to string");
  suite.add(["A",null,"C"],"AC","Append null with separator");
  suite.add([null,"B"],"B","Append string to null");
  suite.add([null,"B","C"],"CB","Append string to null with separator");
  
  suite.execute(Komunalne.util.append, assert.buildFor("equal"));
});

QUnit.test("Path lookup function", function(assert) {
  var obj = { "a": 1, "b": [1,2,3], "c": "str", "d": { "e": "e", "f": { "g": false }, "h": true }, "i": -1 };
  var suite = new Komunalne.test.Suite();
  
  suite.add([obj,"a"],1,"Test simple path ['a']");
  suite.add([obj,"d.e"],"e","Test one depth ['d.e']");
  suite.add([obj,"d.f.g"],false,"Test two depth ['d.f.g']");
  suite.add([obj,"d.i.f"],null,"Test unreachable path === null");
  suite.add([obj,"a.b"],null,"Test try to go deep into a non object");
  
  suite.execute(Komunalne.util.path, assert.buildFor("strictEqual")); 
});

QUnit.test("Data type util functions", function(assert) {
  var dateTest = ["date","invalid-date"];
  var fnTest = ["function"];
  var dateStrictTest = "date";
  var iterableTest = ["empty-object","empty-array"];
  var arrayTest = ["empty-array"];
  var suite,result,msg;
  var all = [dateTest,fnTest,iterableTest,arrayTest];
  var fns = ["isDate","isFunction","isIterable","isArray"];
  var dataNames = {};
  var res;
  
  for (var obj in testData) {
    dataNames[obj] = K.format.capitalize(obj.replace("-"," "));
  }
  
  // Testing isDate, isFunction, isIterable and isArrray.
  for (var i in all) {
    suite = new Komunalne.test.Suite();
    
    for (var obj in testData) {
      result = all[i].indexOf(obj) >= 0;
      msg = dataNames[obj] + " is" + (result ? " " : " not ") + "true for " + fns[i];
      suite.add([testData[obj]], result, msg); 
    }
    
    suite.execute(Komunalne.util[fns[i]],assert.buildFor("strictEqual"));
  }
  
  // Testing isDate in strict mode.
  suite = new Komunalne.test.Suite();
  for (var obj in testData) {
    result = obj === dateStrictTest;
    msg = dataNames[obj] + " is" + (result ? " " : " not ") + "a valid date object";
    suite.add([testData[obj],true],result,msg);
  }
  suite.execute(Komunalne.util.isDate,assert.buildFor("strictEqual"));
  
  // Testing generic isInstanceOf.
  suite = new Komunalne.test.Suite();
  for (var typ in testDataTypes) {
    for (var obj in testData) {
      res = Komunalne.util.arrayContains(obj,testDataTypes[typ].apply);
      suite.add([testData[obj],testDataTypes[typ].type], res, 
                "Object " + dataNames[obj] + " is " + (res ? "" : " not ") + " an object of type " 
                + testDataTypes[typ].type.toString());
    }
  }
  suite.execute(Komunalne.util.isInstanceOf,assert.buildFor("strictEqual"));
});

QUnit.test("Komunalne.js currency formatter", function(assert) {
  var suite = new Komunalne.test.Suite();
  
  // Integers.
  suite.add([1],"1.00","Integer");
  suite.add([0],"0.00","Integer with 0");
  suite.add([666],"666.00","Integer with 3 digits");
  suite.add([1010],"1,010.00","Integer greater than 1000");
  suite.add([123456789012],"123,456,789,012.00","Big integer");
  suite.add([12345],"12,345.00","Integer with 5 digits");
  suite.add([-0],"0.00","-0");
  suite.add([-1],"-1.00","Negative digit");
  suite.add([-123],"-123.00","Negative with 3 digits");
  suite.add([-12345],"-12,345.00","Negative with 5 digits");
  suite.add([-123456789012],"-123,456,789,012.00","Big negative");
  
  // floats.
  suite.add([1.23],"1.23","Float");
  suite.add([0.01],"0.01","Float between 0 and 1");
  suite.add([-12.34],"-12.34","Negative float");
  suite.add([-12345678.901234],"-12,345,678.90","Big negative float");
  suite.add([1.235],"1.24","Rounding up");
  suite.add([1.234],"1.23","Rounding down");
  suite.add([1.2],"1.20","Padding zeros");
  suite.add([1.999],"2.00","Complex rounding up");
  suite.add([-1.999],"-2.00","Negative complex round");
  
  // formatter changing default parameters.
  suite.add([1.234444,3],"1.234","3 decimals round down");
  suite.add([1.234567,4],"1.2346","4 decimals round up");
  suite.add([0.000001,3],"0.000","Round down to 0");
  suite.add([1.2,6],"1.200000","Padding zeros");
  suite.add([1.20019001,4],"1.2002","4 decimals round up");
  suite.add([1.23,3,"@"],"1@230","Changing decimal separator");
  suite.add([12345.567,2,"-","="],"12=345-57", 
              "Changing both decimal and thousands separators");
  suite.add([12345.6543,2,"$%&","--"],"12--345$%&65", 
              "Length > 1 separators");
  
  suite.execute(Komunalne.format.currency, assert.buildFor("equal"));
});

QUnit.test("General testing to format functions", function(assert) {
  var suite = new Komunalne.test.Suite();
  
  suite.add(["string"],"String","Simple capitalization");
  suite.add(["sTrInG"],"String","Capitalization of multiple uppercase string letters");
  
  suite.execute(Komunalne.format.capitalize, assert.buildFor("equal"));
});
