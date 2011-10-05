/** author: lo sauer,'11
Examples using the islib
MIT license applies
*/

var x = [];
x[100] = 1;
x.length
is.NoElements(x) == 1 ? "x has one non-empty Element" : '';
 

if( navigator.is.Chrome ) {
  console.log("I am neither Mac nor PC, for I am Chrome!");
}
is.XHRStatusOK = {status : 204} && is.XHRStatusOK
//returns:
//>>> true
is.XHRStatusOK = {status : 300} && is.XHRStatusOK
//returns:
//>>> false

var url = "http://xhr2.blogspot.com";
var content = XHR(url);
function XHR(url){
  var xhr = is.newXhrObj;//new XMLHttpRequest()
  xhr.open('GET', url, false); //false...ynchronous mode, i.e. non- AJAX
  try{
    xhr.send(null);
    if( is.XHRStatus = xhr && is.XHRStatus ) { //or: if(is.XHRStatusOK(xhr))...
      var e = Error("Could not load:" + uri + "|status:" + xhr.status);
      e.status = xhr.status;
      e.responseText = xhr.responseText;
      return is.Debug ? is.Exit = e : null;
    }
  }catch(e){
    return is.Error(e, null); //or return is.Debug ? is.Errror(e) : null;
  }
  return xhr.responseText; // String 
}
