/**
 * DOM utilities (not necessary using jQuery).
 */

/**
 * Alternative to $.text(). Returns/replace the text of the element matched with the specified id.
 * In contrast with $.text(), this returns/replace the text of the element matched only, not the descendants.
 */
Komunalne.dom.elementText = function(id,text) {
  var el = Komunalne.util.isInstanceOf(id,"string") ? document.getElementById(id) : id;
  if (el != null) {
    if (text != null) el.childNodes[0].nodeValue = text;
    text = el.childNodes[0].nodeValue;
  } else text = null;
  return text;
};
