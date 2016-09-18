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
