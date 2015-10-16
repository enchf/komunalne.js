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
  
  suite.add({ "expected": 1 });
  suite.add({ "expected": 2, "args": ["Fake",2] });
  suite.add({ "expected": 3, "args": ["Fake",3], "msg": "Message" });
  
  suite.execute(function(a,b,c) {
    assert.equal(a,arguments.length,"Arguments number for object " + i);
    assert.equal(a,i,"Execution order " + (i++));
  },function(name,x) { return x; });
  
  var ignoreOnlyNullOrUndefined = new Komunalne.test.Case(
    { "expected": "", "args": [], "msg": "Append without arguments" });
  var funct = function(a,b,c) { 
    assert.equal(arguments.length, 3, "Preventing to avoid skip false-able values ('',false,...)");
    assert.deepEqual(a,"","Check to prevent skipping empty strings");
    assert.equal(b,"","Check to prevent skipping empty strings");
    assert.equal(c,ignoreOnlyNullOrUndefined.msg,"Check for third argument");
  };
  ignoreOnlyNullOrUndefined.execute(funct,new Komunalne.helper.Method(function() { return ""; }));
});

QUnit.test("Iterator implementation", function(assert) {
  var a,b,c,d,e,f,g,h,v,w;
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
  v = [1,2,3];
  v.a = "1";
  v.b = 5;
  w = new Komunalne.helper.Iterator(v);
  
  // Wrapper for the exception tests.
  var wrapper = function(iterator) { return function() { iterator.next(); }; };
  var keyWrapper = function(iterator) { return function() { iterator.currentKey(); }; };
  
  assert.strictEqual(a.hasNext(),false,"No next item on empty object");
  assert.strictEqual(b.hasNext(),true,"Object with set keys has next items");
  assert.strictEqual(c.hasNext(),false,"No next item on empty array");
  assert.strictEqual(d.hasNext(),true,"Non empty array has next item");
  assert.strictEqual(g.hasNext(),false,"No next item on empty arguments iterator");
  assert.strictEqual(h.hasNext(),true,"Arguments iterator has next item");
  assert.strictEqual(w.hasNext(),true,"Array with properties iterator has next item");
  
  assert.strictEqual(a.length(),0,"Length of empty object is 0");
  assert.strictEqual(b.length(),4,"Length of test data object");
  assert.strictEqual(c.length(),0,"Length of empty array is 0");
  assert.strictEqual(d.length(),3,"Length of test array");
  assert.strictEqual(g.length(),0,"Length of empty arguments iterator is 0");
  assert.strictEqual(h.length(),3,"Length of arguments iterator");
  assert.strictEqual(w.length(),5,"Length of array with properties iterator");
  
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
  assert.throws(keyWrapper(w),Komunalne.helper.Iterator.keyError,
                "Exception calling current key before next, array with properties iterator");
  
  assert.strictEqual(b.next(),1,"First item retrieval on object iterator");
  assert.equal(b.currentKey(),"a","First item key on object iterator");
  assert.strictEqual(d.next(),1,"First item retrieval on array iterator");
  assert.equal(d.currentKey(),0,"First item key on array iterator");
  assert.strictEqual(h.next(),4,"First item retrieval on arguments iterator");
  assert.equal(h.currentKey(),0,"First item key on array iterator");
  assert.strictEqual(w.next(),1,"First item retrieval on array with properties iterator");
  assert.equal(w.currentKey(),0,"First key on array with properties should be the index 0");
  
  assert.strictEqual(b.remaining(),3,"Remaining function working properly on object iterator");
  assert.strictEqual(d.remaining(),2,"Remaining function working properly on array iterator");
  assert.strictEqual(b.length(),4,"Length unchanged after moving forward on object iterator");
  assert.strictEqual(d.length(),3,"Length unchanged after moving forward on array iterator");
  assert.strictEqual(h.length(),3,"Length unchanged after moving forward on arguments iterator");
  assert.strictEqual(e.remaining(),4,"Iterator created with same object unchanged after move forward");
  assert.strictEqual(f.remaining(),3,"Iterator created with same array unchanged after move forward");
  assert.strictEqual(w.remaining(),4,"Remaining function working properly on array with properties iterator");
  
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
  
  assert.strictEqual(w.next(),2,"Retrieval order on array with properties iterator, second array element");
  assert.equal(w.currentKey(),1,"Key order on array with properties iterator, second array element");
  assert.strictEqual(w.next(),3,"Retrieval order on array with properties iterator, third array element");
  assert.equal(w.currentKey(),2,"Key order on array with properties iterator, third array element");
  assert.strictEqual(w.next(),"1","Retrieval order on array with properties iterator, first property element");
  assert.strictEqual(w.currentKey(),"a","Key order on array with properties iterator, first property element");
  assert.strictEqual(w.next(),5,"Retrieval order on array with properties iterator, second property element");
  assert.strictEqual(w.currentKey(),"b","Key order on array with properties iterator, second property element");
});

QUnit.test("Append util function", function(assert) {
  var suite = new Komunalne.test.Suite();
  
  suite.add({ "expected": "", "args": [], "msg": "Call to append without arguments" });
  suite.add({ "expected": "", "args": [""], "msg": "Call to append with empty string" });
  suite.add({ "expected": "Str", "args": ["Str"], "msg": "Call to append with single string" });
  suite.add({ "expected": "A B", "args": ["A","B"], "msg": "Call to append with two strings" });
  suite.add({ "expected": "ACB", "args": ["A","B","C"], "msg": "Call to append with three strings" });
  suite.add({ "expected": "A", "args": ["A",null], "msg": "Append null to string" });
  suite.add({ "expected": "AC", "args": ["A",null,"C"], "msg": "Append null with separator" });
  suite.add({ "expected": "B", "args": [null,"B"], "msg": "Append string to null" });
  suite.add({ "expected": "CB", "args": [null,"B","C"], "msg": "Append string to null with separator" });
  
  suite.execute(assert.buildFor("equal"),Komunalne.util.append);
});

QUnit.test("Path lookup function", function(assert) {
  var obj = { "a": 1, "b": [1,2,3], "c": "str", "d": { "e": "e", "f": { "g": false }, "h": true }, "i": -1 };
  var suite = new Komunalne.test.Suite();
  suite.add({ "expected": 1, "args": [obj,"a"], "msg": "Test simple path ['a']" });
  suite.add({ "expected": "e", "args": [obj,"d.e"], "msg": "Test one depth ['d.e']" });
  suite.add({ "expected": false, "args": [obj,"d.f.g"], "msg": "Test two depth ['d.f.g']" });
  suite.add({ "expected": null, "args": [obj,"d.i.f"], "msg": "Test unreachable path === null" });
  suite.add({ "expected": null, "args": [obj,"a.b"], "msg": "Test try to go deep into a non object" });
  suite.execute(assert.buildFor("strictEqual"),Komunalne.util.path); 
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
      suite.add({ "expected": result, "args": [testData[obj]], "msg": msg }); 
    }
    suite.execute(assert.buildFor("strictEqual"),Komunalne.util[fns[i]]);
  }
});

QUnit.test("Date type test in strict mode", function(assert) {
  var suite = new Komunalne.test.Suite();
  var result,msg;
  var dateStrictTest = "date";
  
  for (var obj in testData) {
    result = obj === dateStrictTest;
    msg = dataNames[obj] + " is" + (result ? " " : " not ") + "a valid date object";
    suite.add({ "expected": result, "args": [testData[obj],true], "msg": msg });
  }
  suite.execute(assert.buildFor("strictEqual"),Komunalne.util.isDate);
});

QUnit.test("Is instance of type test", function(assert) {
  var suite = new Komunalne.test.Suite();
  var res;
  for (var typ in testDataTypes) {
    for (var obj in testData) {
      res = Komunalne.util.arrayContains(obj,testDataTypes[typ].apply);
      suite.add({ "expected": res, "args": [testData[obj],testDataTypes[typ].type],
                  "msg": "Object " + dataNames[obj] + " is " + (res ? "" : " not ") + " an object of type " 
                + testDataTypes[typ].type.toString() });
    }
  }
  suite.execute(assert.buildFor("strictEqual"),Komunalne.util.isInstanceOf);
});

QUnit.test("Is Array of search", function(assert) {
  var suite = new Komunalne.test.Suite();
  suite.add({ "args": [[1,2,3],"number"], "msg": "Full numbers array" });
  suite.add({ "args": [[],"string"], "msg": "Empty array qualifies as array of any type" });
  suite.add({ "args": [[new T(),new T()],T], "msg": "Array of custom types" });
  suite.add({ "args": [[new T(),new T()],"object"], "msg": "Array of custom types against object" });
  suite.add({ "args": [[[],[]],Array], "msg": "Array of arrays" });
  suite.execute(assert.buildFor("ok"),Komunalne.util.isArrayOf);
  suite.clear();
  suite.add({ "args": [[1,2,true,3],"number"], "msg": "Partial numbers array" });
  suite.add({ "args": [[1,2,3],"string"], "msg": "Wrong type comparison" });
  suite.add({ "args": [[new T(),new U(),new T()],T], "msg": "Array of custom types intermixed" });
  suite.add({ "args": [{},"number"], "msg": "Not array passed as argument" });
  suite.execute(assert.buildFor("notOk"),Komunalne.util.isArrayOf);
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
      suite.add(x == y,[data[x],data2[y]],"Comparison between " + x + " and " + y + ": " + (x == y));
    }
  }
  suite.execute(assert.buildFor("strictEqual"),Komunalne.util.areSameClass);
});

QUnit.test("Deep equals", function(assert) {
  var suite = new Komunalne.test.Suite();
  suite.add({ "args": [testData.array,testData.array], "msg": "Equal arrays comparison" });
  suite.add({ "args": [[],[]], "msg": "Comparing empty arrays" });
  suite.add({ "args": [[{},1,true],[{},1,true]], "msg": "Two equal arrays containing objects" });
  suite.add({ "args": [[[1,3],{a:1},1],[[1,3],{a:1},1]], "msg": "Two equal arrays containing objects and arrays" });
  suite.add({ "args": [testData.object,testData.object], "msg": "Equal object comparison" });
  suite.add({ "args": [{},{}], "msg": "Comparing empty objects" });
  suite.add({ "args": [{"a":{},"b":1,"c":true},{"a":{},"b":1,"c":true}], "msg": "Two equal objects containing objects" });
  suite.add({ "args": [{"a":[1,2],"b":{a:1},"c":1},{"a":[1,2],"b":{a:1},"c":1}], "msg": "Equal mixed objects" });
  suite.add({ "args": [new T(),new T()], "msg": "Equal objects of custom types" });
  suite.execute(assert.buildFor("ok"),Komunalne.util.deepEquals);
  
  suite.clear();
  suite.add({ "args": [[1,2,3],[3,2,1]], "msg": "Comparing reversed arrays" });
  suite.add({ "args": [[1,2,3,4],[1,2,3]], "msg": "Comparing almost equal arrays" });
  suite.add({ "args": [[1,2,3],[1,2,3,4]], "msg": "Comparing almost equal arrays" });
  suite.add({ "args": [[[1,3],{b:1}],[[1,3],{b:2}]], "msg": "Mixed arrays unequal in second one object value" });
  suite.add({ "args": [[[1,2,3],{b:1}],[[1,2,3],{a:1}]], "msg": "Arrays of objects and arrays unequal in key name" });
  suite.add({ "args": [[[1,2,3,4],{b:1}],[[1,2,3],{b:1}]], "msg": "Mixed arrays unequal in array content" });
  suite.add({ "args": [[{b:2},[1,2,3]],[[1,2,3],{b:2}]], "msg": "Mixed arrays unequal in element order" });
  suite.add({ "args": [testData.object,{"d":4,"c":3,"b":2,"a":1}], "msg": "Comparing objects with reversed keys" });
  suite.add({ "args": [testData.object,{"a":1,"b":2,"c":3}], "msg": "Comparing almost equal objects" });
  suite.add({ "args": [{"a":1,"b":2,"c":3},testData.object], "msg": "Comparing almost equal objects" });
  suite.add({ "args": [{"a":[1],"b":{b:1}},{"a":[1,3],"b":{b:2}}], "msg": "Objects unequal in second one object value" });
  suite.add({ "args": [{"a":[1,2,3],"b":{b:1}},{"a":[1,2,3],"b":{a:1}}], "msg": "Objects unequal in key name" });
  suite.add({ "args": [{"a":[1,2,3,4],"b":{b:1}},{"a":[1,2,3],"b":{b:1}}], "msg": "Objects unequal in array content" });
  suite.add({ "args": [{"a":{b:2},"b":[1,2,3]},{"a":[1,2,3],"b":{b:2}}], "msg": "Objects unequal in element order" });
  suite.add({ "args": [new U(),new T()], "msg": "Equal objects but of different custom type" });
  suite.execute(assert.buildFor("notOk"),Komunalne.util.deepEquals);
});

QUnit.test("Array lookup functions (array contains and is any of?)", function(assert) {
  var aux;
  var suite = new Komunalne.test.Suite();
  
  suite.add({ "args": [1,[1,2,3]], "msg": "Lookup for existing element" });
  suite.add({ "args": [(aux=new T()),[new T(),aux,{}]], "msg": "Lookup for objects where is present the same instance" });
  suite.add({ "args": [new T(),[new T(),new T()],true], "msg": "Lookup for equally objects using deep equals flag" });
  suite.add({ "args": [{a:1},[{a:2},{a:1},{a:3}],true], "msg": "Lookup for existing object with deep equals flag" });
  suite.add({ "args": [[1,2],[[1,3],[1,2]],true], "msg": "Lookup for arrays with deep equals flag" });
  suite.add({ "args": [(aux=[1,2]),[[1,3],[1,2],aux]], "msg": "Lookup for array instance without deep equals flag" });
  suite.execute(assert.buildFor("ok"),Komunalne.util.arrayContains);
  suite.clear();
  suite.add({ "args": [0,[1,2,3]], "msg": "Lookup for non existing element" });
  suite.add({ "args": [new T(),[new T(),new T()]], "msg": "Lookup for objects but not exactly the same instance" });
  suite.add({ "args": [new T(),[new T(),new T()],"true"], 
              "msg": "Lookup for equally objects using non strict deep equals flag" });
  suite.add({ "args": [{a:1},[{c:{a:1}},2,""],true], "msg": "Lookup for unexisting object" });
  suite.add({ "args": [{a:1},[{a:2},{a:1},{a:3}]], "msg": "Lookup for existing object without deep equals flag" });
  suite.add({ "args": [[1,2],[[1,3],[1,2]]], "msg": "Lookup for arrays without deep equals flag" });
  suite.execute(assert.buildFor("notOk"),Komunalne.util.arrayContains);
  
  suite.clear();
  suite.add({ "args": [1,2,3,4,1,5], "msg": "Lookup for existing integer in arguments list" });
  suite.add({ "args": ["1",2,3,"4",1,"1",5], "msg": "Lookup in mixed-type array for existing element" });
  suite.add({ "args": [(aux=new U()),new T(),new U(),aux,new T()], "msg": "Lookup for the same instance objects" });
  suite.add({ "args": [(aux=[1,2]),[1,3],aux,[1,2],[1,4]], "msg": "Lookup for the same instance array" });
  suite.execute(assert.buildFor("ok"),Komunalne.util.isAnyOf);
  suite.clear();
  suite.add({ "args": [0,2,3,4,1,5], "msg": "Lookup for non existing integer in arguments list" });
  suite.add({ "args": ["1",2,3,"4",1,5], "msg": "Lookup in mixed-type array for non-exactly-the-same-type element" });
  suite.add({ "args": [new T(),new T(),new U(),new T()], "msg": "Lookup for objects but not the same instance" });
  suite.add({ "args": [[1,2],[1,3],[1,2],[1,4]], "msg": "Lookup for arrays but not the same instance" });
  suite.execute(assert.buildFor("notOk"),Komunalne.util.isAnyOf);
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
  var keys = "";
  var current;
  var test = function(x,i,obj) { 
    str += x; 
    keys += i;
    assert.equal(obj,current,"Validation of iterated object as argument");
  };
  var fn = function() { 
    current = arguments;
    Komunalne.util.forEach(arguments,test);
  };
  var F = function(obj) { 
    this.str = "";
    this.keys = "";
    this.obj = obj;
  };
  F.prototype.fn = function(x,i,obj) { 
    this.str += x;
    this.keys += i;
    assert.equal(obj,this.obj,"Validation of iterated object as argument in scoped calls");
  };
  var f;
  
  current = [1,2,3];
  Komunalne.util.forEach(current,test);
  assert.strictEqual(str,"123","For each in array: values");
  assert.strictEqual(keys,"012","For each in array: keys");
  str = "";
  keys = "";
  
  current = {a:1,b:2,c:4};
  Komunalne.util.forEach(current,test);
  assert.strictEqual(str,"124","For each in object: values");
  assert.strictEqual(keys,"abc","For each in object: keys");
  str = "";
  keys = "";
  
  fn(1,2,3,5,8);
  assert.strictEqual(str,"12358","For each with arguments: values");
  assert.strictEqual(keys,"01234","For each with arguments: keys");
  
  f = new F([3,2,1]);
  Komunalne.util.forEach(f.obj,f.fn,f);
  assert.strictEqual(f.str,"321","For each with scope and array: values");
  assert.strictEqual(f.keys,"012","For each with scope and array: keys");
  
  f = new F({a:true,b:false});
  Komunalne.util.forEach(f.obj,f.fn,f);
  assert.strictEqual(f.str,"truefalse","For each with scope and object: values");
  assert.strictEqual(f.keys,"ab","For each with scope and object: keys");
});

QUnit.test("Currency formatter", function(assert) {
  var suite = new Komunalne.test.Suite();
  
  // Integers.
  suite.add({ "args": [1], "expected": "1.00", "msg": "Integer" });
  suite.add({ "args": [0], "expected": "0.00", "msg": "Integer with 0" });
  suite.add({ "args": [666], "expected": "666.00", "msg": "Integer with 3 digits" });
  suite.add({ "args": [1010], "expected": "1,010.00", "msg": "Integer greater than 1000" });
  suite.add({ "args": [123456789012], "expected": "123,456,789,012.00", "msg": "Big integer" });
  suite.add({ "args": [12345], "expected": "12,345.00", "msg": "Integer with 5 digits" });
  suite.add({ "args": [-0], "expected": "0.00", "msg": "-0" });
  suite.add({ "args": [-1], "expected": "-1.00", "msg": "Negative digit" });
  suite.add({ "args": [-123], "expected": "-123.00", "msg": "Negative with 3 digits" });
  suite.add({ "args": [-12345], "expected": "-12,345.00", "msg": "Negative with 5 digits" });
  suite.add({ "args": [-123456789012], "expected": "-123,456,789,012.00", "msg": "Big negative" });
  
  // floats.
  suite.add({ "args": [1.23], "expected": "1.23", "msg": "Float" });
  suite.add({ "args": [0.01], "expected": "0.01", "msg": "Float between 0 and 1" });
  suite.add({ "args": [-12.34], "expected": "-12.34", "msg": "Negative float" });
  suite.add({ "args": [-12345678.901234], "expected": "-12,345,678.90", "msg": "Big negative float" });
  suite.add({ "args": [1.235], "expected": "1.24", "msg": "Rounding up" });
  suite.add({ "args": [1.234], "expected": "1.23", "msg": "Rounding down" });
  suite.add({ "args": [1.2], "expected": "1.20", "msg": "Padding zeros" });
  suite.add({ "args": [1.999], "expected": "2.00", "msg": "Complex rounding up" });
  suite.add({ "args": [-1.999], "expected": "-2.00", "msg": "Negative complex round" });
  
  // formatter changing default parameters.
  suite.add({ "args": [1.234444,3], "expected": "1.234", "msg": "3 decimals round down" });
  suite.add({ "args": [1.234567,4], "expected": "1.2346", "msg": "4 decimals round up" });
  suite.add({ "args": [0.000001,3], "expected": "0.000", "msg": "Round down to 0" });
  suite.add({ "args": [1.2,6], "expected": "1.200000", "msg": "Padding zeros" });
  suite.add({ "args": [1.20019001,4], "expected": "1.2002", "msg": "4 decimals round up" });
  suite.add({ "args": [1.23,3,"@"], "expected": "1@230", "msg": "Changing decimal separator" });
  suite.add({ "args": [12345.567,2,"-","="], "expected": "12=345-57", 
              "msg": "Changing both decimal and thousands separators" });
  suite.add({ "args": [12345.6543,2,"$%&","--"], "expected": "12--345$%&65", 
              "msg": "Length > 1 separators" });
  
  suite.execute(assert.buildFor("equal"),Komunalne.format.currency);
});

QUnit.test("General testing to format functions", function(assert) {
  var suite = new Komunalne.test.Suite();
  suite.add({ "args": ["string"], "expected": "String", "msg": "Simple capitalization" });
  suite.add({ "args": ["sTrInG"], "expected": "String", "msg": "Capitalization of multiple uppercase string letters" });
  suite.execute(assert.buildFor("equal"),Komunalne.format.capitalize);
});
