/**
 * Executor function.
 * @param method Method to be executed.
 * @param scope (optional) Method scope.
 */
Komunalne.helper.Method = function(method,scope) {
  this.fn = method;
  this.scope = scope != undefined ? scope : null;
};
Komunalne.helper.Method.prototype.apply = function(args) { return this.fn.apply(this.scope,args); };
Komunalne.helper.Method.prototype.call = function() { return this.fn.apply(this.scope,arguments); };

/**
 * Java-like Iterator implementation for arrays and objects.
 */
Komunalne.helper.Iterator = function(object) {
  this.keys = [];
  this.i = 0;
  this.ref = object;
  for (var x in object) this.keys.push(x);
};
Komunalne.helper.Iterator.prototype.hasNext = function() { return this.i < this.keys.length; };
Komunalne.helper.Iterator.prototype.next = function() {
  if (!this.hasNext()) throw "Iterator index out of bounds: " + this.i;
  return this.ref[this.keys[this.i++]];
};
Komunalne.helper.Iterator.prototype.length = function() { return this.keys.length; };
Komunalne.helper.Iterator.prototype.remaining = function() { return this.length() - this.i; };
