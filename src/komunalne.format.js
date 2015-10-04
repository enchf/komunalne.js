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

