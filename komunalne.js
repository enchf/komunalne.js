/*! komunalne 2016-09-20 */
/**
 * Komunalne.js - Javascript utils compilation.
 * Object definition.
 */
function Komunalne() {};
Komunalne.helper = {};
Komunalne.util = {};
Komunalne.format = {};
Komunalne.test = {};
Komunalne.$ = {};
Komunalne.dom = {};
Komunalne.anim = {};
Komunalne.isOldIE = false;

/* Shortcut if not defined already */
if (window.K === undefined) window.K = Komunalne;

/**
 * Polyfill issues in IE 8-9.
 */
if (typeof String.prototype.trim !== 'function') {
  Komunalne.isOldIE = true;
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

//Production steps of ECMA-262, Edition 5, 15.4.4.14
//Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Komunalne.isOldIE = true;
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

//Production steps of ECMA-262, Edition 5, 15.4.4.18
//Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
  Komunalne.isOldIE = true;
  Array.prototype.forEach = function(callback, thisArg) {
    var T = undefined, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP
               ? this
               : oThis,
               aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * Komunalne.js jQuery utilities.
 */

/**
 * Alternative to $.text() for jQuery objects. Returns/replace the text of the element matched with the specified id.
 * In contrast with $.text(), this returns/replace the text of the element matched only, not the descendants.
 */
Komunalne.$.elementText = function(selector,text) {
  return Komunalne.dom.elementText($(selector).get(0),text);
};

/**
 * Call this method to set the items that match the specified selectors with full screen height.
 * Method should be called within an $(function() { ... }) "onReady" block or when the screen is ready.
 */
Komunalne.$.fullHeight = function(selectors) {
  var adjustHeight;
  adjustHeight = function(selector) { $(selector).css("min-height",$(window).height()); };
  selectors = Komunalne.util.isArray(selectors) ? selectors : [selectors];
  selectors.forEach(function(selector) {
    var bind = adjustHeight.bind(null,selector);
    $(window).resize(bind);
    $(window).load(bind);
  });
};

/**
 * CSS Animation utils.
 */

/**
 * Using Animate.css. Sets an animation to a target and quits after animation completes.
 * @see http://daneden.github.io/animate.css/
 */
Komunalne.anim.animate = function(effect,target) {
  var ends = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  return new Promise(function(resolve,reject) {
    effect = Komunalne.util.append("animated",effect);
    $(target).addClass(effect).one(ends,function() {
      $(this).removeClass(effect);
      resolve(this);
    });
  });
};

/**
 * Using Animate.css. Sets an animation to a target and quits after animation completes.
 * Includes handlers to execute before and after animation.
 * @see http://daneden.github.io/animate.css/
 */
Komunalne.anim.animation = function(effect,target,before,after) {
  var ends = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var starts = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart';
  var resolver;

  effect = Komunalne.util.append("animated",effect);
  target = $(target);
  resolver = function(res,rej) {
    var wrapAfter = function() {
      target.removeClass(effect);
      after(target);
      res(target);
    };
    target.addClass(effect).one(starts,before).one(ends,wrapAfter);
  };

  return new Promise(resolver);
};


/**
 * DOM utilities (not necessary using jQuery).
 */

/**
 * Alternative to $.text(). Returns/replace the text of the element matched with the specified id.
 * In contrast with $.text(), this returns/replace the text of the element matched only, not the descendants.
 * In case of replace (text != null), if the element has multiple text nodes, text will be replaced in the first found.
 */
Komunalne.dom.elementText = function(id,text) {
  var i,buf,aux = null;
  var el = Komunalne.util.isInstanceOf(id,"string") ? document.getElementById(id) : id;
  if (el != null) {
    if (!el.hasChildNodes()) {
      if (text != null) el.appendChild(document.createTextNode(text));
      else text = "";
    } else {
      if (text != null) {
        i = new Komunalne.helper.Iterator(el.childNodes);
        while (i.hasNext()) {
          aux = i.next();
          if (aux.nodeType == 3) break;
          else aux = null;
        }
        if (aux != null) aux.nodeValue = text;
        else el.appendChild(document.createTextNode(text));
      } else {
        buf = [];
        i = new Komunalne.helper.Iterator(el.childNodes);
        while (i.hasNext()) {
          aux = i.next();
          if (aux.nodeType == 3) buf.push(aux.nodeValue);
        }
        text = buf.join();
      }
    }
  } else text = null;
  return text;
};

/**
 * Formats a number as a currency.
 * @param num Number object. Mandatory to be a number or a parseable number.
 * @param nd (optional) Number of decimals, default to 2.
 * @param ds (optional) Decimal separator, default to '.'.
 * @param ms (optional) Milliard separator, default to ','.
 */
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
 * Creates a capitalized string setting the first letter uppercase and the rest to lowercase.
 * @param str String to be capitalized.
 */
Komunalne.format.capitalize = function(str) { return str[0].toUpperCase() + str.substr(1).toLowerCase(); };

/**
 * Executor function wrapper, with optional predefined scope.
 * @param method Method to be executed.
 * @param scope (optional) Method scope.
 */
Komunalne.helper.Method = function(method,scope) {
  this.fn = method;
  this.scope = scope != undefined ? scope : null;
};

/**
 * The native apply JS method for the array passed as argument.
 */
Komunalne.helper.Method.prototype.apply = function(args) { return this.fn.apply(this.scope,args); };

/**
 * The native call JS method for the passed arguments.
 */
Komunalne.helper.Method.prototype.call = function() { return this.fn.apply(this.scope,arguments); };

/**
 * Java-like Iterator implementation for arrays and objects.
 */
Komunalne.helper.Iterator = function(object) {
  this.keys = Komunalne.util.keys(object);
  this.i = 0;
  this.ref = object;
};

/* Statics */
Komunalne.helper.Iterator.keyError = "Iterator has not started to retrieve elements";
Komunalne.helper.Iterator.nextError = "Iterator index out of bounds: ";

/* Iterator prototype */

/**
 * True if there are more elements to iterate.
 */
Komunalne.helper.Iterator.prototype.hasNext = function() { return this.i < this.keys.length; };

/**
 * Returns the next element in the iteration.
 */
Komunalne.helper.Iterator.prototype.next = function() {
  if (!this.hasNext()) throw Komunalne.helper.Iterator.nextError + this.i;
  return this.ref[this.keys[this.i++]];
};

/**
 * Determines the iteration length.
 */
Komunalne.helper.Iterator.prototype.length = function() { return this.keys.length; };

/**
 * Determines the number of remaining elements in the iteration.
 */
Komunalne.helper.Iterator.prototype.remaining = function() { return this.length() - this.i; };

/**
 * Returns the key (numeric in case of an array/arguments, the key in case of an object) of the last returned element.
 */
Komunalne.helper.Iterator.prototype.currentKey = function() {
  if (this.i === 0) throw Komunalne.helper.Iterator.keyError;
  return this.keys[this.i - 1];
};

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
    if (Komunalne.util.isInstanceOf(el,Object) && el[paths[p]] !== undefined) el = el[paths[p]];
    else { el = null; break; }
  }
  return el;
};

/**
 * Returns true if the object passed as argument is a Date.
 * If strict mode is set to true, returns true only if the Date object is valid.
 * @param date Object to be validated as date.
 * @param strict True to check the date validity, false to only check the type.
 */
Komunalne.util.isDate = function(date,strict) {
  return (date instanceof Date) && (!strict || !isNaN(date.valueOf()));
};

/**
 * Returns true if the argument is a function.
 * @param obj Object to be validated as function.
 */
Komunalne.util.isFunction = function(obj) { return typeof obj == "function"; };

/**
 * Returns true if the object is iterable in a 'for (var x in obj) {}' statement.
 * @param obj Object to be validated as iterable.
 */
Komunalne.util.isIterable = function(obj) {
  return typeof obj == "object" && obj != undefined && !Komunalne.util.isDate(obj);
};

/**
 * Returns true if the object is an Array.
 * @param obj Object to be validated as an array.
 */
Komunalne.util.isArray = function(obj) {
  return Komunalne.util.isIterable(obj) && obj.constructor && obj.constructor == Array;
};

/**
 * Checks an object against a specific type.
 * Scenarios:
 * - Param 'type' is string: Compares 'obj' as primitive using typeof against 'type'.
 * - Param 'type' is a function: If obj is an object, compares obj.constructor with type.
 *   Otherwise, uses instanceof operator against obj.
 * - Otherwise: Throws exception.
 */
Komunalne.util.isInstanceOf = function(obj,type) {
  var res;
  if (typeof type == "string") res = (typeof obj == type);
  else if (Komunalne.util.isFunction(type)) {
    if (obj instanceof Object) res = obj.constructor === type;
    else res = obj instanceof type;
  } else throw "Invalid comparison of " + (typeof obj) + " against " + (typeof type);
  return res;
};

/**
 * Test whether an array is completely filled with objects of the specified type.
 * Type can be a primitive name (string) or a function object.
 */
Komunalne.util.isArrayOf = function(obj,type) {
  var is = Komunalne.util.isArray(obj);
  var i = new Komunalne.helper.Iterator(obj,type);
  while (is && i.hasNext()) is = Komunalne.util.isInstanceOf(i.next(),type);
  return is;
};

/**
 * Checks if both arguments are of the same class.
 */
Komunalne.util.areSameClass = function(a,b) {
  return (typeof a) == (typeof b) && ((typeof a == "object") ? a.constructor === b.constructor : true);
};

/**
 * Do a deep equality test on the arguments.
 * The arguments should be equals in type, constructor (if they are objects), and:
 * - If they are objects, the same keys in the same defined order.
 * - If they are arrays, the same elements in the same position.
 */
Komunalne.util.deepEquals = function(a,b) {
  var ai,bi,ait,bit,an,bn;
  var equal = true;
  ai = Komunalne.util.isIterable(a);
  bi = Komunalne.util.isIterable(b);

  if (ai && bi && (equal = Komunalne.util.areSameClass(a,b))) {
    ait = new Komunalne.helper.Iterator(a);
    bit = new Komunalne.helper.Iterator(b);
    equal = ait.length() == bit.length();

    while (ait.hasNext() && equal) {
      an = ait.next();
      bn = bit.next();
      equal = Komunalne.util.deepEquals(an,bn);
      equal = equal && ait.currentKey() == bit.currentKey();
    }
  } else equal = (ai == bi && a === b);

  return equal;
};

/**
 * True if the first argument is contained in the second argument array.
 * @param item Lookup item into the array.
 * @param array Array to be inspected.
 * @param deep True to use a deep equals comparing item with array elements.
 */
Komunalne.util.arrayContains = function(item,array,deep) {
  var it,found;
  if (deep === true) {
    it = new Komunalne.helper.Iterator(array);
    found = false;
    while (it.hasNext() && !found) found = Komunalne.util.deepEquals(item,it.next());
  } else found = array.indexOf(item) >= 0;
  return found;
};

/**
 * Check if any of the arguments passed correspond to the first one.
 * Sample: Komunalne.util.isAnyOf(1,5,3,1,2,4) will return true as 1 is part of [5,3,1,2,4].
 */
Komunalne.util.isAnyOf = function(item) {
  return Komunalne.util.arrayContains(item,Array.prototype.slice.call(arguments,1));
};

/**
 * Concatenate the arrays passed as arguments into a new array object.
 */
Komunalne.util.arrayConcat = function() {
  var arr = [];
  var i = new Komunalne.helper.Iterator(arguments);
  while (i.hasNext()) arr = arr.concat(i.next());
  return arr;
};

/**
 * For each method that works both on objects or array/arguments.
 * It uses a K.helper.Iterator in case of arrays to include not only indexes but added properties (i.e. [].b = 1).
 * The method passes the arguments to the callback function in the same way as native Array.forEach does:
 * - value: The value element.
 * - key: Index for arrays and key for objects.
 * - object: The iterated array or object.
 */
Komunalne.util.forEach = function(obj,fn,scope) {
  var i = new Komunalne.helper.Iterator(obj);
  while (i.hasNext()) fn.call(scope,i.next(),i.currentKey(),obj);
};

/**
 * Clones an object, according to the configuration object, as defined below:
 * - deep: If present and set to true, it will clone the objects within the cloned object recursively.
 *         Otherwise, the subobjects and arrays are copied by reference.
 * - into: If present and its an object instance, object properties are either cloned or copied
 *         (depending on the deep flag) into this one instead of creating a new instance.
 *         Otherwise, the cloned object is newly created using original object constructor.
 *         This flag is only valid for the uppermost parent object (the one which the function has invoked).
 *         For sub-objects, always a newly object is created using constructor.
 * - safe: True to clone/copy only the non-present properties in the target object.
 *         Applicable only if into is set.
 * - skip: Applicable in any configuration. Can be an array or a string.
 *         Avoids cloning the properties specified in this parameter.
 *         Accepts subproperties with dot notation, only applicable in deep cloning.
 *         Any misconfiguration will make skip to be ignored.
 * The function takes care of circular references in deep cloning.
 * If object is not an object or a null/undefined reference, it is returned itself.
 */
Komunalne.util.clone = function(obj,cfg) {
  var seen = [];
  var clones = [];
  var first = true;
  var replica,refer;
  var skip,innerSkip;

  cfg = (cfg || {});
  if ("into" in cfg && (!Komunalne.util.isInstanceOf(cfg.into,"object") || cfg.into == null)) {
    throw Komunalne.util.clone.invalidTarget;
  }
  replica = function(val,skip) { return clone(val,cfg,skip); };
  refer = function(val) { return val; };
  skip = ("skip" in cfg) ?
          ((Komunalne.util.isArray(cfg.skip) && Komunalne.util.isArrayOf(cfg.skip,"string")) ? cfg.skip
          : (Komunalne.util.isInstanceOf(cfg.skip,"string")) ? [cfg.skip] : [])
        : [];
  innerSkip = function(skip) {
    var index;
    var clone = Komunalne.util.clone(skip);
    var iterator = new Komunalne.helper.Iterator(clone);
    var next,i;

    while (iterator.hasNext()) {
      next = iterator.next();
      i = iterator.currentKey();
      clone[i] = ((index = clone[i].indexOf(".")) >= 0) ? clone[i].substr(index+1) : "";
    }
    return clone;
  };

  var clone = function(obj,cfg,skip) {
    var c,i,fn;
    var subskip;

    if (obj == null || !Komunalne.util.isInstanceOf(obj,"object")) c = obj;
    else if (Komunalne.util.isInstanceOf(obj,Date)) c = new Date(obj.getTime());
    else if (cfg.deep === true && (i = seen.indexOf(obj)) >= 0) c = clones[i];
    else {
      seen.push(obj);
      // The object is tried to be created using constructor.
      // If something fails, the object is passed as reference.
      if (first && "into" in cfg) c = cfg.into;
      else {
        try { c = new obj.constructor(); }
        catch (e) { c = obj; }
      }
      clones.push(c);
      first = false;
      if (cfg.deep === true) {
        fn = replica;
        subskip = innerSkip(skip);
      } else {
        fn = refer;
        subskip = [];
      }
      for (var x in obj) {
        if (Komunalne.util.arrayContains(x,skip)) continue;
        c[x] = (cfg.safe !== true || c[x] === undefined) ? fn(obj[x],subskip) : c[x];
      }
    }

    return c;
  };
  return clone(obj,cfg,skip);
};
Komunalne.util.clone.invalidTarget = "Target object is null or not an object";

/**
 * Return the keys of an object/array.
 */
Komunalne.util.keys = function(obj) {
  var keys = [];
  obj = (obj || {});

  for (var x in obj) {
    if (Komunalne.isOldIE &&
      (
        (Komunalne.util.isArray(obj) && (x == "indexOf" || x == "forEach")) ||
        (Komunalne.util.isInstanceOf(obj,"string") && (x == "trim")) ||
        (Komunalne.util.isFunction(obj) && (x == "bind"))
      )
    ) {
      continue;
    }
    keys.push(x);
  }

  return keys;
};
