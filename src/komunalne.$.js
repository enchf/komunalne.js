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