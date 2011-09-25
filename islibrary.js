// Copyright (C) 2011 by Lorenz Sauer
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// key: IUPAC Name , value: CAS-Number, sorted: asort

/**
'is' is a lightweight JS library with useful validations and checks providing a good starting point for any script
It will remain >3kB 
Primarily, 'is' should contain methods which return boolean values, but features some additional functions
TODO: check if all references are OK for GC
Happy Hacking!
(c) 2011 Lorenz Sauer, MIT License
(c) 'Type' function by Angus Croll
*/
is = (function(){
  return {
    xhrStatus : {},
    Debug : false,    //<boolean> e.g. allow failing by throwing errors, logging...
    XMLHTTP :         [ 'Msxml2.XMLHTTP.4.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP' ], 
    get AdobeAIR()    { return (navigator.userAgent.indexOf("AdobeAIR") >= 0) ? true : false; },
    get Air()         { return this.AdobeAIR;},
    get Khtml()       { return (navigator.appVersion.indexOf("Konqueror") >= 0) ? parseFloat(navigator.appVersion) : false; },
    get WebKit()      { return parseFloat(navigator.userAgent.split("WebKit/")[1]) || false; },
    get Chrome()      { return this.WebKit; },
    get Opera()       { return navigator.userAgent.indexOf("Opera") >= 0 ? true : false ;},
    get OperaNew()    { return parseFloat(navigator.appVersion) >= 9.6 ? (parseFloat(navigator.userAgent.split("Version/")[1]) || parseFloat(navigator.appVersion)) : false; },
    get Presto()      { return this.Opera; },
    get IE()          { return document.all && !this.Opera ? parseFloat(navigator.appVersion.split("MSIE ")[1]) || false /*document.documentMode*/ : false; },
    get FF()          { return navigator.userAgent.indexOf("Gecko") >= 0 && !this.Khtml && !this.WebKit; },
    get Gecko()       { return this.FF; },
    get Mac()         { return navigator.appVersion.indexOf("Macintosh") >= 0; },
    get Win()         { return navigator.appVersion.indexOf("Win") >= 0; },
    get X11()         { return navigator.appVersion.indexOf("X11") >= 0; },
    get Unix()        { return this.X11 },
    get Linux()       { return navigator.appVersion.indexOf("Linux") >= 0; },
    get ChromeOS()    { return /Google/i.test(navigator.appVersion); },
    get iOS()         { return /iPod|iPhone|iPad/i.test(navigator.userAgent); },
    get Wii()         { return  typeof opera != "undefined" && opera.wiiremote; },
    get XHRActiveX()  { return this.IE && window.location.protocol === 'file:'; }, //check in IE 7, to overcome some bugs
    get QuirksMode()  { return document.compatMode === 'BackCompat'},
    set XHRStatus(o)  { this.xhrStatus = o;}, //204:OK, 304 cache, 1223 IE bug ( 204 translated to 1223?)
    get XHRStatusOK() { var o = this.xhrStatus; return (o.status >= 200 && o.status < 300) || o.status == 304 || o.status == 1223 || false; },
    get newXhrObj()   { if( typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest; else for(var i=3; i--;){ try{ var xhttp = new ActiveXObject( this.XMLHTTP[i] ); return  xhttp; }catch(e){ is.Warn(e); } } },
    set Exit(e)       { throw e; }, //quits the script
    Error :           function(e,ret){ if( this.Debug){ throw e; } else{ console.error(e); } return typeof ret !== 'undefined' ? ret : e;},
    Warn :            function(e,ret){ if( this.Debug){ console.warn(e); } return typeof ret !== 'undefined' ? ret : e;},
    /* Types */
    Type :            function(o) { return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();},
    Array :           function(a)   { return a instanceof Array; },
    ObjSame:          function(a,b) { return a.constructor === b.constructor; }, //compares left to right object
    String :          function(s)   { return typeof s === 'string'; },
    Object :          function(o)   { return o !== null && o instanceof Object; },
    Empty :           function(o)   { if( typeof o === 'undefined') return undefined; else return !Boolean(o); }, 
    Void :            function(o)   { return !Boolean(o); }, //less strict than Empty
    OfValue :         function(o)   { return Boolean(o); }, //less strict than Empty
    IsSet :           function(o)   { return typeof o !== 'undefined' && Boolean(o); },
    Number :          function(n)   { if( typeof n === 'undefined') return undefined; if( typeof n === 'number' && n !== Number.NaN && Math.abs(n) !== Infinity ) return true; else false; },
    Between :         function(n,a,b) { n = parseFloat(n); if(! this.Number(n)) return undefined; return a<n && n<b; },//in JS a<n<b will eval to a<n || n<b; e.g. 5<4<10 -> true
    NoElements :      function(a)   { for(var i=cnt=0; i<a.length;cnt+= !this.Void(a[i++]) ); return cnt;}, //returns array length, measured by non-empty elements
    // takes an xml-string and return a DOM object if valid xml otherwise false; assumes a modern browser w. DOMParser
    XMLString :       function(s)   { var dom = null;
                                    if ( s && s.constructor === String ){
                                      if( this.IE ){
                                          dom = new ActiveXObject("MSXML2.DOMDocument");
                                          dom.async = false;
                                          dom = dom.loadXML(s);
                                      } else{
                                          dom = new DOMParser();
                                          dom = dom.parseFromString(s, "text/xml");
                                      }
                                    } 
                                    if(!dom) return false;
                                    else return dom;
                    },
  }
})();

