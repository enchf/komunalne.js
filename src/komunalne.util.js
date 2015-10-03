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
    if (typeof el === "object" && el[paths[p]] !== undefined) el = el[paths[p]]; 
    else { el = null; break; }
  }
  return el;
};
