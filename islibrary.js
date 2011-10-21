// Copyright (C) 2011 by lo sauer
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

/**
author: lo sauer
description:  'is' is a lightweight javascript library with useful validations and check methods which
              provide a good starting point for any other cross-browser scripting logic
              One of its premises is to remain >10kB (for the minified version)
task: Primarily, 'is' should contain methods which return boolean values, but also some additional 'core' functions
TODO: check if all references are OK for garbage collection / unit checking
implement connectivity status e.g. for an animated connection status button

...perhaps islib should get two siblings, 'in' and 'to'...
upd. 08/10/'11: eventually there will be two objects: islib and tolib
upd. 09/10/'11: for now various functions are packed into, some of which may be removed at a later point
cleaning and rewriting to make the code smaller will start at version .5


current version v.3 - 09/10/11

      Happy Hacking!
(c) 2011 lo sauer, MIT License
(c) 'Type' function by Angus Croll
*/
var is = (function(){
  return {
    xhrStatus : {},    //holds the status of the most recent XHR call
    Debug : false,    //<boolean> e.g. allow failing by throwing errors, logging...
    XMLHTTP :         [ 'Msxml2.XMLHTTP.4.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP' ], 
    get FileAccess()  { return typeof(window.File) !== 'undefined' && typeof(window.FileReader) === 'function' && typeof(window.FileList) !== 'undefined'; },
    get DragSupport() { var el = document.getElementsByTagName('body')[0]; if(!el) return false; else return el.hasOwnProperty('ondragenter') && el.hasOwnProperty('ondragend'); },
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
    get XHRStatus()   { return this.XHRStatusOK(this.xhrStatus); },
    XHRStatusOK :     function(o){ if(undefined == o) var o = this.xhrStatus; return (o.status >= 200 && o.status < 300) || o.status == 304 || o.status == 1223 || false; },
    get newXhrObj()   { if( typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest; else for(var i=3; i--;){ try{ var xhttp = new ActiveXObject( this.XMLHTTP[i] ); return  xhttp; }catch(e){ is.Warn(e); } } },
    get ConnStatus()  { /*TODO*/},
    set Exit(e)       { throw e; }, //quits the script
    //passthrough Error function e.g. scenario in a function ....return is.Error(e, false); -> processes the error and returns false
    Error :           function(e,ret){ if( this.Debug){ throw e; } else{ if(this.Object(e)){ for(i in e) console.error(e[i]);} else console.error ? console.error(e) : console.log('Error: '+e); } return typeof ret !== 'undefined' ? ret : e;},
    Warn :            function(e,ret){ if( this.Debug){ console.warn(e); } return typeof ret !== 'undefined' ? ret : e;},
    /* Types */
    Type :            function(o) { return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();},
    Array :           function(a)   { return a && (a instanceof Array|| typeof a == "array"); },
    ObjSame:          function(a,b) { return a.constructor === b.constructor; }, //compares left to right object
    String :          function(s)   { return typeof s === 'string'; },
    Object :          function(o)   { return o !== null && o instanceof Object; },
    Empty :           function(o)   { if( typeof o === 'undefined') return undefined; else return !Boolean(o); }, 
    Void :            function(o)   { return !Boolean(o); }, //less strict than Empty
    'Function' :      function(o)   { return Object.prototype.toString(x)==="[object Function]"; }, //checks for function via 'object' tostring method
    Native :          function(o)   { return (o && !this.Function(o) && /\{\[native code\]\}/i.test(String(o)));}, //Checks for native functions
    Extend :          function (o, n, fn) { if(this.Object(o) ) o.__proto__[n] = fn; else o.prototype[n] = fn; return o; }, //o:object to be extended, n:name, fn: func to be loaded onto the proto-chain
    //Returns a function which exectues in the scope defined by self; supply a variable list of arguments after fn e.g. (self, fn, arg1....)
    BoundFunc :       function(self, fn){ return function(){ var f = fn.constructor === String ? (self||window)[fn] : fn; return f.apply(self || this, Array.apply(null,arguments).slice(2));};},    
    OfValue :         function(o)   { return Boolean(o); }, //less strict than Empty
    Set :           function(o)   { return typeof o !== 'undefined' && Boolean(o); },
    Number :          function(n)   { if( typeof n === 'undefined') return undefined; if( typeof n === 'number' && n !== Number.NaN && Math.abs(n) !== Infinity ) return true; else false; },
    Between :         function(n,a,b) { n = parseFloat(n); if(! this.Number(n)) return undefined; return a<n && n<b; },//in JS a<n<b will eval to a<n || n<b; e.g. 5<4<10 -> true
    NoElements :      function(a)   { for(var i=cnt=0; i<a.length;cnt+= !this.Void(a[i++]) ); return cnt;}, //returns array length, measured by non-empty elements
    //----------'to'-lib--------//
    Basename :        function(s)   { if(undefined===s) s = window.location.href; return s.substr(0, s.lastIndexOf('/')+1)},
    Filename :        function(s)   { if(undefined===s) s = window.location.href; return s.substr(s.lastIndexOf('/')+1)},
    Anonymous :       function(fn)  { return fn.constructor === Function && fn.name === ''; },
    //PHP's trim function; chs: provide an arbitrary trim character list
    Trim :            function(s, chs){ if(!chs) return this.valueOf().trim(); var restr = '['+s.split('').join('|')+']*'; return this.valueOf().replace(RegExp('^'+restr+'|'+restr+'$','g'),'');},
    // takes an xml-string and returns a DOM object if valid xml is passed, otherwise false; assumes a modern browser w. DOMParser
    XMLString :       function(s)   { var dom = null;
                                    if ( s && s.constructor === String ){
                                      if( this.IE ){ dom = new ActiveXObject("MSXML2.DOMDocument"); dom.async = false;  dom = dom.loadXML(s);
                                      } else{ dom = new DOMParser(); dom = dom.parseFromString(s, "text/xml");
                                      }
                                    } 
                                    if(!dom) return false;
                                    else return dom;
                    },
    //d...decimal,
    //h...hexadecimal
    //i....integer
    //b...binary
    //from http://lsauer.com/2011/09/javascript-binary-to-int-hex-decimal.html
    d2h :           function(d) { return d.toString(16); },
    h2d :           function(h) { return parseInt(h,16); },
    d2b :           function(d) { return d.toString(2); },
    d2h :           function(d) { return d.toString(16); },
    b2d :           function(d) { return parseInt(d,2); },
    itoa :          String.fromCharCode, //see: http://lsauer.com/2011/08/javascript-itoa-atoi-prototype-convert.html
    atoi :          String.charCodeAt,
    //RFC  rfc4122v4 via map
    GUID :          function(DCE){ return (DCE?'{':'')+('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('').map( function(v){if(v in {'4':0,'-':0})return v; var i=Math.random()*16|0, c= v=='x' ? i : (i&3|8);  return c.toString(16);} ).join(''))+(DCE?'}':'')},
    get Uuid()      {return this.GUID(); },
    //returns the name of the current function; returns false if the function is nameless but not ""
    //e.g. function myfn(){return is.NameFunc}; myfn() -> "myfn"
    get NameFunc(levl)  {var n = levl||1; var fn = arguments.callee.caller; return this.Anonymous(fn) ? false : arguments.callee.caller.name; },  
    //clone a primitive object by invoking the constructor directly; __proto__-chain is not copied; runtime parameters may change e.g. Date objects
    clone :         function clone(o) { if (!o || !this.Object(o) ) return o; var onew = o.constructor(o.valueOf()); for (var attr in o) { if (o.hasOwnProperty(attr)) onew[attr] = o[attr]; } return onew;},  
    //Pythonian range function in JS; best loaded to Number.prototype.range
    // e.g. is.Range(0,10,2) -> [0, 2, 4, 6, 8, 10] ; is.Range(10,0,-2) -> [10, 8, 6, 4, 2, 0]
    //3 arguments; start, stop, step
    Range :         function(st,so,sp){var args = arguments; args.length == 1 ? (start=0, stop=args[0], step=1) : (start=args[0], stop=args[1], step=args[2]==null? 1:args[2]); for (var i=start,a=[]; step>0 ? i<=stop:i>=stop; i+=step){a.push(i)} return a },
		Unique :        function(a){ return a.sort().filter( function(v,i,o){if(i>0 && v!==o[i-1]) return v;}); },

  };
})();


navigator.is = window.is;