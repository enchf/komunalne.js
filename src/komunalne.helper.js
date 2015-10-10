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
  this.keys = [];
  this.i = 0;
  this.ref = (object || []);
  for (var x in object) this.keys.push(x);
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
