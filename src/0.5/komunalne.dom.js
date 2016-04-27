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
