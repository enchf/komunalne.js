/**
 * Komunalne.js test data.
 */
var T = function(){};
var U = function(){};

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
  "function": function() {},
  "array": [1,2,3],
  "object": {"a":1,"b":2,"c":3,"d":4},
  "t": new T(),
  "u": new U()
};

var dataNames = {};

(function() {
  for (var obj in testData) {
    dataNames[obj] = Komunalne.format.capitalize(obj.replace("-"," "));
  }
})();

var testDataTypes = {
  "object": { "type": "object", "apply": 
             ["t","u","empty-object","empty-array","null","date","invalid-date","array","object"] },
  "Array": { "type": Array, "apply": ["empty-array","array"] },
  "undefined": { "type": "undefined", "apply": ["undefined"] },
  "string": { "type": "string", "apply": ["string"] },
  "number": { "type": "number", "apply": ["number","negative-number","zero","floating-point-number"] },
  "boolean": { "type": "boolean", "apply": ["true","false"] },
  "Date": { "type": Date, "apply": ["date","invalid-date"] },
  "function": { "type": "function", "apply": ["function"] },
  "custom": { "type": T, "apply": ["t"] },
  "custom-2": { "type": U, "apply": ["u"] }
};

/***************************
 * Komunalne.js test cases.
 ***************************/

QUnit.test("Komunalne.js Definition", function(assert) {
  assert.ok(Komunalne,"Komunalne.js object defined");
  assert.ok(Komunalne.format,"Komunalne.js formatters container defined");
  assert.ok(Komunalne.test,"Komunalne.js unit testing helpers");
  assert.ok(Komunalne.helper,"Komunalne.js helpers container");
  assert.ok(Komunalne.test,"Komunalne.js test container");
});

QUnit.test("Unit test executor", function(assert) {
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

QUnit.test("Iterator implementation", function(assert) {
  var a,b,c,d,e,f,g,h;
  var nextError = Komunalne.helper.Iterator.nextError;
  var keyError = Komunalne.helper.Iterator.keyError;
  
  a = new Komunalne.helper.Iterator(testData["empty-object"]);
  b = new Komunalne.helper.Iterator(testData.object);
  c = new Komunalne.helper.Iterator(testData["empty-array"]);
  d = new Komunalne.helper.Iterator(testData.array);
  e = new Komunalne.helper.Iterator(testData.object);
  f = new Komunalne.helper.Iterator(testData.array);
  g = new Komunalne.helper.Iterator();
  h = (function() { return new Komunalne.helper.Iterator(arguments); })(4,5,6);
  
  // Wrapper for the exception tests.
  var wrapper = function(iterator) { return function() { iterator.next(); }; };
  var keyWrapper = function(iterator) { return function() { iterator.currentKey(); }; };
  
  assert.strictEqual(a.hasNext(),false,"No next item on empty object");
  assert.strictEqual(b.hasNext(),true,"Object with set keys has next items");
  assert.strictEqual(c.hasNext(),false,"No next item on empty array");
  assert.strictEqual(d.hasNext(),true,"Non empty array has next item");
  assert.strictEqual(g.hasNext(),false,"No next item on empty arguments iterator");
  assert.strictEqual(h.hasNext(),true,"Arguments iterator has next item");
  
  assert.strictEqual(a.length(),0,"Length of empty object is 0");
  assert.strictEqual(b.length(),4,"Length of test data object");
  assert.strictEqual(c.length(),0,"Length of empty array is 0");
  assert.strictEqual(d.length(),3,"Length of test array");
  assert.strictEqual(g.length(),0,"Length of empty arguments iterator is 0");
  assert.strictEqual(h.length(),3,"Length of arguments iterator");
  
  assert.throws(keyWrapper(a),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, empty object iterator");
  assert.throws(keyWrapper(b),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, object iterator");
  assert.throws(keyWrapper(c),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, empty array iterator");
  assert.throws(keyWrapper(d),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, array iterator");
  assert.throws(keyWrapper(g),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, empty arguments iterator");
  assert.throws(keyWrapper(h),Komunalne.helper.Iterator.keyError,
                "Exception calling currenty key before next, arguments iterator");
  
  assert.strictEqual(b.next(),1,"First item retrieval on object iterator");
  assert.equal(b.currentKey(),"a","First item key on object iterator");
  assert.strictEqual(d.next(),1,"First item retrieval on array iterator");
  assert.equal(d.currentKey(),0,"First item key on array iterator");
  assert.strictEqual(h.next(),4,"First item retrieval on arguments iterator");
  assert.equal(h.currentKey(),0,"First item key on array iterator");
  
  assert.strictEqual(b.remaining(),3,"Remaining function working properly on object iterator");
  assert.strictEqual(d.remaining(),2,"Remaining function working properly on array iterator");
  assert.strictEqual(b.length(),4,"Length unchanged after moving forward on object iterator");
  assert.strictEqual(d.length(),3,"Length unchanged after moving forward on array iterator");
  assert.strictEqual(h.length(),3,"Length unchanged after moving forward on arguments iterator");
  assert.strictEqual(e.remaining(),4,"Iterator created with same object unchanged after move forward");
  assert.strictEqual(f.remaining(),3,"Iterator created with same array unchanged after move forward");
  
  assert.throws(wrapper(a),nextError + "0","Exception thrown calling next on empty object iterator");
  assert.throws(wrapper(c),nextError + "0","Exception thrown calling next on empty array iterator");
  assert.throws(wrapper(g),nextError + "0","Exception thrown calling next on empty array iterator");
  b.next(); b.next();
  assert.strictEqual(b.remaining(),1,"Remaining working after sucessive calls to next on object iterator");
  assert.equal(b.currentKey(),"c","Key before last call of next on object iterator");
  assert.strictEqual(b.next(),4,"Retrieving the last item on object iterator");
  assert.equal(b.currentKey(),"d","Last key of object iterator");
  assert.throws(wrapper(b),nextError + "4","Exception thrown after exhausting object iterator");
  assert.strictEqual(b.length(),4,"Length unchanged after exhausting object iterator");
  assert.strictEqual(b.remaining(),0,"Remaining is 0 even after multiple next calls on exhausted object iterator");
  assert.strictEqual(b.hasNext(),false,"No next element on exhausted object iterator");
  assert.strictEqual(e.next(),1,"Iterator created with same object working after exhausting the other one");
  d.next();
  assert.strictEqual(d.remaining(),1,"Remaining working after sucessive calls to next on array iterator");
  assert.equal(d.currentKey(),1,"Key before last call of next on array iterator");
  assert.strictEqual(d.next(),3,"Retrieving the last item on array iterator");
  assert.equal(d.currentKey(),2,"Key before last call of next on array iterator");
  assert.throws(wrapper(d),nextError + "3","Exception thrown after exhausting array iterator");
  assert.strictEqual(d.length(),3,"Length unchanged after exhausting array iterator");
  assert.strictEqual(d.remaining(),0,"Remaining is 0 even after multiple next calls on exhausted array iterator");
  assert.strictEqual(d.hasNext(),false,"No next element on exhausted array iterator");
  assert.strictEqual(f.next(),1,"Iterator created with same array working after exhausting the other one");
  h.next();
  assert.strictEqual(h.remaining(),1,"Remaining working after sucessive calls to next on arguments iterator");
  assert.equal(h.currentKey(),1,"Key before last call of next on arguments iterator");
  assert.strictEqual(h.next(),6,"Retrieving the last item on arguments iterator");
  assert.equal(h.currentKey(),2,"Key before last call of next on arguments iterator");
  assert.throws(wrapper(h),nextError + "3","Exception thrown after exhausting arguments iterator");
  assert.strictEqual(h.length(),3,"Length unchanged after exhausting arguments iterator");
  assert.strictEqual(h.remaining(),0,"Remaining is 0 even after multiple next calls on exhausted arguments iterator");
  assert.strictEqual(h.hasNext(),false,"No next element on exhausted arguments iterator");
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

QUnit.test("Date, Function, Iterable and Array type test functions", function(assert) {
  var dateTest = ["date","invalid-date"];
  var fnTest = ["function"];
  var iterableTest = ["empty-object","empty-array","object","array","t","u"];
  var arrayTest = ["empty-array","array"];
  var suite,result,msg;
  var all = [dateTest,fnTest,iterableTest,arrayTest];
  var fns = ["isDate","isFunction","isIterable","isArray"];
  
  for (var i in all) {
    suite = new Komunalne.test.Suite();
    
    for (var obj in testData) {
      result = all[i].indexOf(obj) >= 0;
      msg = dataNames[obj] + " is" + (result ? " " : " not ") + "true for " + fns[i];
      suite.add([testData[obj]], result, msg); 
    }
    
    suite.execute(Komunalne.util[fns[i]],assert.buildFor("strictEqual"));
  }
});

QUnit.test("Date type test in strict mode", function(assert) {
  var suite = new Komunalne.test.Suite();
  var result,msg;
  var dateStrictTest = "date";
  
  for (var obj in testData) {
    result = obj === dateStrictTest;
    msg = dataNames[obj] + " is" + (result ? " " : " not ") + "a valid date object";
    suite.add([testData[obj],true],result,msg);
  }
  suite.execute(Komunalne.util.isDate,assert.buildFor("strictEqual"));
});

QUnit.test("Is instance of type test", function(assert) {
  var suite = new Komunalne.test.Suite();
  var res;
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

QUnit.test("Is Array of search", function(assert) {
  var suite = new Komunalne.test.Suite();
  suite.add([[1,2,3],"number"],true,"Full numbers array");
  suite.add([[1,2,true,3],"number"],false,"Partial numbers array");
  suite.add([[1,2,3],"string"],false,"Wrong type comparison");
  suite.add([[],"string"],true,"Empty array qualifies as array of any type");
  suite.add([[new T(),new T()],T],true,"Array of custom types");
  suite.add([[new T(),new U(),new T()],T],false,"Array of custom types intermixed");
  suite.add([[new T(),new T()],"object"],true,"Array of custom types against object");
  suite.add([[[],[]],Array],true,"Array of arrays");
  suite.add([{},"number"],false,"Not array passed as argument");
  suite.execute(Komunalne.util.isArrayOf,assert.buildFor("strictEqual"));
});

QUnit.test("Are of same class? comparison", function(assert) {
  var suite = new Komunalne.test.Suite();
  var data = { 
    "number": 1, "boolean": true, "string": "str", "object":{}, "array": [1,2], "function": T, "t": new T(), "u": new U() 
  };
  var data2 = {
    "number": 2, "boolean": false, "string": "", "object":{a:1}, "array": [], "function": U, "t": new T(), "u": new U()
  };
  for (var x in data) {
    for (var y in data2) {
      suite.add([data[x],data2[y]],x == y,"Comparison between " + x + " and " + y + ": " + (x == y));
    }
  }
  suite.execute(Komunalne.util.areSameClass,assert.buildFor("strictEqual"));
});

QUnit.test("Deep equals", function(assert) {
  var suite = new Komunalne.test.Suite();
  suite.add([testData.array,testData.array],true,"Equal arrays comparison");
  suite.add([[1,2,3],[3,2,1]],false,"Comparing reversed arrays");
  suite.add([[1,2,3,4],[1,2,3]],false,"Comparing almost equal arrays");
  suite.add([[1,2,3],[1,2,3,4]],false,"Comparing almost equal arrays");
  suite.add([[],[]],true,"Comparing empty arrays");
  suite.add([[{},1,true],[{},1,true]],true,"Two equal arrays containing objects");
  suite.add([[[1,2,3],{a:1},1],[[1,2,3],{a:1},1]],true,"Two equal arrays containing objects and arrays");
  suite.add([[[1,2,3],{b:1}],[[1,2,3],{b:2}]],false,"Arrays of objects and arrays unequal in second one object value");
  suite.add([[[1,2,3],{b:1}],[[1,2,3],{a:1}]],false,"Arrays of objects and arrays unequal in key name");
  suite.add([[[1,2,3,4],{b:1}],[[1,2,3],{b:1}]],false,"Arrays of objects and arrays unequal in array content");
  suite.add([[{b:2},[1,2,3]],[[1,2,3],{b:2}]],false,"Arrays of objects and arrays unequal in element order");
  
  suite.add([testData.object,testData.object],true,"Equal object comparison");
  suite.add([testData.object,{"d":4,"c":3,"b":2,"a":1}],false,"Comparing objects with reversed keys");
  suite.add([testData.object,{"a":1,"b":2,"c":3}],false,"Comparing almost equal objects");
  suite.add([{"a":1,"b":2,"c":3},testData.object],false,"Comparing almost equal objects");
  suite.add([{},{}],true,"Comparing empty objects");
  suite.add([{"a":{},"b":1,"c":true},{"a":{},"b":1,"c":true}],true,"Two equal objects containing objects");
  suite.add([{"a":[1,2],"b":{a:1},"c":1},{"a":[1,2],"b":{a:1},"c":1}],true,"Equal objects containing objects and arrays");
  suite.add([{"a":[1,2],"b":{b:1}},{"a":[1,2,3],"b":{b:2}}],false,"Objects unequal in second one object value");
  suite.add([{"a":[1,2,3],"b":{b:1}},{"a":[1,2,3],"b":{a:1}}],false,"Objects unequal in key name");
  suite.add([{"a":[1,2,3,4],"b":{b:1}},{"a":[1,2,3],"b":{b:1}}],false,"Objects unequal in array content");
  suite.add([{"a":{b:2},"b":[1,2,3]},{"a":[1,2,3],"b":{b:2}}],false,"Objects unequal in element order");
  suite.add([new T(),new T()],true,"Equal objects of custom types");
  suite.add([new U(),new T()],false,"Equal objects but of different custom type");
  suite.execute(Komunalne.util.deepEquals,assert.buildFor("strictEqual"));
});

QUnit.test("Array lookup functions (array contains and is any of?)", function(assert) {
  var suite = new Komunalne.test.Suite();
  var aux;
  suite.add([1,[1,2,3]],true,"Lookup for existing element");
  suite.add([0,[1,2,3]],false,"Lookup for non existing element");
  suite.add([new T(),[new T(),new T()]],false,"Lookup for objects but not exactly the same instance");
  suite.add([(aux=new T()),[new T(),aux,new T()]],true,"Lookup for objects where is present the same instance");
  suite.add([new T(),[new T(),new T()],true],true,"Lookup for equally objects using deep equals flag");
  suite.add([new T(),[new T(),new T()],"true"],false,"Lookup for equally objects using non strict deep equals flag");
  suite.add([{a:1},[{c:{a:1}},2,""],true],false,"Lookup for unexisting object");
  suite.add([{a:1},[{a:2},{a:1},{a:3}]],false,"Lookup for existing object without deep equals flag");
  suite.add([{a:1},[{a:2},{a:1},{a:3}],true],true,"Lookup for existing object with deep equals flag");
  suite.add([[1,2],[[1,3],[1,2]],true],true,"Lookup for arrays with deep equals flag");
  suite.add([[1,2],[[1,3],[1,2]]],false,"Lookup for arrays without deep equals flag");
  suite.add([(aux=[1,2]),[[1,3],[1,2],aux]],true,"Lookup for exactly array instance without deep equals flag");
  suite.execute(Komunalne.util.arrayContains,assert.buildFor("strictEqual"));
  
  suite = new Komunalne.test.Suite();
  suite.add([1,2,3,4,1,5],true,"Lookup for existing integer in arguments list");
  suite.add([0,2,3,4,1,5],false,"Lookup for non existing integer in arguments list");
  suite.add(["1",2,3,"4",1,"1",5],true,"Lookup in mixed-type array for existing element");
  suite.add(["1",2,3,"4",1,5],false,"Lookup in mixed-type array for non-exactly-the-same-type element");
  suite.add([new T(),new T(),new U(),new T()],false,"Lookup for objects but not the same instance");
  suite.add([(aux=new U()),new T(),new U(),aux,new T()],true,"Lookup for the same instance objects");
  suite.add([[1,2],[1,3],[1,2],[1,4]],false,"Lookup for arrays but not the same instance");
  suite.add([(aux=[1,2]),[1,3],aux,[1,2],[1,4]],true,"Lookup for the same instance array");
  suite.execute(Komunalne.util.isAnyOf,assert.buildFor("strictEqual"));
});

QUnit.test("Array concatenation", function(assert) {
  var a=[1,2,3], b=[4,5,6], c=[7,8,9,0], d;
  assert.deepEqual(Komunalne.util.arrayConcat(),[],"Empty concatenation");
  assert.deepEqual((d=Komunalne.util.arrayConcat(a,b,c)),[1,2,3,4,5,6,7,8,9,0],"Array concatenation");
  assert.equal(a.length,3,"Concatenated arrays not affected");
  d[1]=100;
  assert.equal(a[1],2,"Concatenated arrays not affected after modifying resulting array");
});

QUnit.test("For each function for objects, arguments and arrays", function(assert) {
  var str = "";
  var test = function(x) { str += x; };
  var fn = function() { Komunalne.util.forEach(arguments,test); };
  var F = function() { this.str = ""; };
  F.prototype.fn = function(x) { this.str += x; };
  var f = new F();
  
  Komunalne.util.forEach([1,2,3],test);
  assert.strictEqual(str,"123","For each in array");
  str = "";
  
  Komunalne.util.forEach({a:1,b:2,c:4},test);
  assert.strictEqual(str,"124","For each in object");
  str = "";
  
  fn(1,2,3,5,8);
  assert.strictEqual(str,"12358","For each with arguments");
  
  Komunalne.util.forEach([3,2,1],f.fn,f);
  assert.strictEqual(f.str,"321","For each with scope and array");
  f = new F();
  
  Komunalne.util.forEach({a:true,b:false},f.fn,f);
  assert.strictEqual(f.str,"truefalse","For each with scope and object");
});

QUnit.test("Currency formatter", function(assert) {
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
