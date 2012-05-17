// Copyright (C) 2011 by lo sauer - 2011, univie
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

VERSIONS:
  *do not use in an productive scenario yet
        version v.5 - 28/10/11
current version v.7a - 01/05/12

NOTE:
  *naming, packing etc... are all subject to change
  *current focus lies in implementing the required functionality
  27/10
  +several new functions

  *will be split into is/to/has - lib
  !function names are not finalized and subject to change!

package.json
{
  "name": "islib",
  "description": "is.lib is a self-contained package, returning the boolean values regarding a given state.",
  "keywords": ["type","number","check","truth", "cross", "browser", "library", "validation"],
}


      Happy Hacking!
(c) 2011 lo sauer, MIT License
(c) 'Type' function by Angus Croll
*/
var _is = (function(){
	var _self = this
		,_log = []
		,__version__ = .7
		,__module__ = 'isLib'
		,__desc__ = 'is-lib + get-lib + set-lib; mixed functions; (alpha)';

  return {
    //basic module functions: leave these intact
    get __version__(){return __version__;},
    get __module__(){return [__module__, __desc__];},
    
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
    get newXhrObj()   { if( typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest; else if(window.ActiveXObject) for(var i=3; i--;){ try{ var xhttp = new ActiveXObject( this.XMLHTTP[i] ); return  xhttp; }catch(e){ is.Warn(e); } } return false; },
    get ConnStatus()  { /*TODO*/},
    set Exit(e)       { throw e; }, //quits the script
    itoa :            String.fromCharCode, //see: http://lsauer.com/2011/08/javascript-itoa-atoi-prototype-convert.html; In code golf, this will play better: \u0034...
    atoi :            String.charCodeAt,
    //passthrough Error function e.g. scenario in a function ....return is.Error(e, false); -> processes the error and returns false
    Error :           function(e,ret){ if( this.Debug){ throw e; } else{ if(this.Object(e)){ for(i in e) console.error(e[i]);} else console.error ? console.error(e) : console.log('Error: '+e); } return typeof ret !== 'undefined' ? ret : e;},
    Warn :            function(e,ret){ if( this.Debug){ console.warn(e); } return typeof ret !== 'undefined' ? ret : e;},
    /* Types */
    Native :          function(o)   { return (o && !this.Function(o) && /\{\[native code\]\}/i.test(String(o)));}, //Checks for native functions
    Type :            function(o)   { return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();},
    Array :           function(a)   { return a && (a instanceof Array|| typeof a == "array"); },
    ArrayLike :       function(a)   { return a && this.Native(a) && a.hasOwnProperty('length'); },
    Hash:             function(o)   { return o instanceof Hashtable; }, //for prototype-lib
    Element:          function(o)   { return o && o.nodeType === 0x01; },
    Identical :       function(a,b) { return a.constructor === b.constructor; }, //compares left to right object
    String :          function(s)   { return typeof s === 'string'; },
    Undefined :           function(s)   { return typeof s === 'undefined'; },
    Object :          function(o)   { return o !== null && o instanceof Object; },
    Scalar :          function(o)   { return /boolean|number|string/.test(typeof o); },  //like the php function is_scalar
    Empty :           function(o)   { if( typeof o === 'undefined') return undefined; else return !Boolean(o); }, 
    Void :            function(o)   { return !Boolean(o); }, //less strict than Empty
    'Function' :      function(o)   { return Object.prototype.toString(x)==="[object Function]"; }, //checks for function via 'object' tostring method
    Extend :          function (o,n,fn) { if(this.Object(o) ) o.__proto__[n] = fn; else o.prototype[n] = fn; return o; }, //o:object to be extended, n:name, fn: func to be loaded onto the proto-chain
    XML :             function(o)   { return !!o.ownerDocument && o.ownerDocument.documentElement.nodeName !== "HTML" || o.nodeType === 0x09 && o.documentElement.nodeName !== "HTML";},  //0x09...00001001
    //Returns a function which exectues in the scope defined by self; supply a variable list of arguments after fn e.g. (self, fn, arg1....)
    BoundFunc :       function(self, fn){ return function(){ var f = fn.constructor === String ? (self||window)[fn] : fn; return f.apply(self || this, Array.apply(null,arguments).slice(2));};},    
    OfValue :         function(o)   { return Boolean(o); }, //less strict than Empty
    Set :             function(o)   { return typeof o !== 'undefined' && Boolean(o); },
    Binary :          function(o)   { if( typeof o !== 'string') return false; return !(RegExp("^([\x20-\x7F]+)$").test(o)); }, //checks whether a string is binary vs. typical txt-character set; asciitable http://www.asciitable.com/
    Number :          function(n)   { if( typeof n === 'undefined') return undefined; if( typeof n === 'number' && n !== Number.NaN && Math.abs(n) !== Infinity ) return true; else false; },
    Numeric :         function(n)  {  return (typeof(n) === 'number' || typeof(n) === 'string') && n !== '' && !this.NaN(n);  }, //from phpjs
    Int :             function(o)   { return o === ~~o; }, // e.g. is.Int(1.3) >false; is.Int(100) > true; is.Int("023") > false
    NaN :             function(o)   { return typeof val === 'number' && isNaN(val); }, // whether argument is a number  
    Null :            function(o)   { return null === o; }, // Returns true if variable is null   
    Between :         function(n,a,b) { n = parseFloat(n); if(! this.Number(n)) return undefined; return a<n && n<b; },//in JS a<n<b will eval to a<n || n<b; e.g. 5<4<10 -> true
    NoElements :      function(a)   { for(var i=cnt=0; i<a.length;cnt+= !this.Void(a[i++]) ); return cnt;}, //returns array length, measured by non-empty elements
    //----------'to'-lib--------//
    //converts an array a into a hash; rev = 1 reverses keys and values
    toObj :           function(a,rev){if(!a || a.constructor !== Array) return; var o={}; for(i in a){ if(!rev) o[i] = a[i]; else o[ a[i] ] = i; } return o; },
    toJSON:           function(o)   { var t = typeof o;if(t in this.toObj(["undefined","function","unknown"],true) ){return;}if("boolean" === t){return o.toString();}if (null === o ){return "null";}if (o.toJSON) {return o.toJSON()}if (this.Element(o)) {return;}var ret = [];for (var prop in o) {var v = o.toJSON(o[prop]);if (!this.Undefined(v)) {ret.push(prop.toJSON() + ": " + v)}}return "{" + ret.join(", ") + "}"; },
    toOrd :           function(i)  {i=(i|0+'').split('').slice(-2).reduce(function(a,b){return 1==a?0:(b>3 ? 0 : b); });return ['th','st','nd','rd'][i]; },  //return english ordinal-suffix for a number
    toExpDec:         function(i)  { var l=Math.log; return Math.ceil(l(i)/l(10)); },
    Keys:             function(o)   { var k=[]; for(var prop in o) {k.push(prop);} return k;},
    Values:           function(o)   { var v = []; for (var prop in o) { v.push(o[prop]) } return v; },    //e.g. can  convert Array-like objects (arguments,..) to Array
    toArray:          function(o)   { return this.Values(o); },    //e.g. can  convert Array-like objects (arguments,..) to Array
    Basename :        function(s)   { if(undefined===s) s = window.location.href; return s.replace(/([/]{2,})/g,'/').substr(0, s.lastIndexOf('/')+1)},
    Filename :        function(s)   { if(undefined===s) s = window.location.href; return s.substr(s.lastIndexOf('/')+1)},
    FileExt :         function(s)   { return s.substr(s.lastIndexOf('.')+1)},
    Anonymous :       function(fn)  { return fn.constructor === Function && fn.name === ''; },
    //PHP's trim function; chs: provide an arbitrary trim character list
    Trim :            function(s, chs){ if(!chs) return this.valueOf().trim(); var restr = '['+s.split('').join('|')+']*'; return this.valueOf().replace(RegExp('^'+restr+'|'+restr+'$','g'),'');},
    // takes an xml-string and returns a DOM object if valid xml is passed, otherwise false; assumes a modern browser w. DOMParser
    XMLString :       function(s)   { var dom = false; if ( s && s.constructor === String ){ if( this.IE ){ dom = new ActiveXObject("MSXML2.DOMDocument"); dom.async = false;  dom = dom.loadXML(s); } else{ dom = new DOMParser(); dom = dom.parseFromString(s, "text/xml"); } }  return dom; },
    //HTMLString  = XMLStringLazy; more leniant; requires Mozilla XPCOM!
    HTMLString :      function(s)   { if(!Components){return this.Error('No XPCOM');}; var c = 'http://www.w3.org/1999/xhtml', d = document, html = d.implementation.createDocument(c, "html", null), b = d.createElementNS(c, "body"); html.documentElement.appendChild(b);{ b.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"].getService(Components.interfaces.nsIScriptableUnescapeHTML).parseFragment(aHTMLString, false, null, b)) };return b;},
    DomInsertAfter :  function(ne,nn){var sbl = ne.nextSibling; ne.parentNode.insertBefore(nn, sbl); return sbl;},
    HTMLInsertAfter : function(ne,s){var _fn =Components?'HTMLString':'XMLString'; if(ne.substr){ne=document.querySelector(ne);}; this.DomInsertAfter(ne, this[_fn](s).documentElement); },
    //d...decimal,
    //h...hexadecimal
    //i....integer
    //b...binary
    //from http://lsauer.com/2011/09/javascript-binary-to-int-hex-decimal.html
    d2h :           function(d)     { return d.toString(16); },
    h2d :           function(h)     { return parseInt(h,16); },
    d2b :           function(d)     { return d.toString(2); },
    d2h :           function(d)     { return d.toString(16); },
    b2d :           function(d)     { return parseInt(d,2); },
    //RFC  rfc4122v4 via map
    GUID :          function(DCE){ return (DCE?'{':'')+('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('').map( function(v){if(v in {'4':0,'-':0})return v; var i=Math.random()*16|0, c= v=='x' ? i : (i&3|8);  return c.toString(16);} ).join(''))+(DCE?'}':'')},
    get Uuid()      {return this.GUID(); },
    //returns the name of the current function; returns false if the function is nameless but not ""
    //e.g. function myfn(){return is.NameFunc}; myfn() -> "myfn"
    NameFunc:       function(levl)  {var n = levl||1; var fn = arguments.callee.caller; return this.Anonymous(fn) ? false : arguments.callee.caller.name; },  
    //clone a primitive object by invoking the constructor directly; __proto__-chain is not copied; runtime parameters may change e.g. Date objects
    Clone :         function(o) { if (!o || !this.Object(o) ) return o; var onew = o.constructor(o.valueOf()); for (var attr in o) { if (o.hasOwnProperty(attr)) onew[attr] = o[attr]; } return onew;},  
    //Pythonian range function in JS; best loaded to Number.prototype.range
    // e.g. is.Range(0,10,2) -> [0, 2, 4, 6, 8, 10] ; is.Range(10,0,-2) -> [10, 8, 6, 4, 2, 0]
    //3 arguments; start, stop, step
    Range :         function(st,so,sp){var args = arguments; args.length == 1 ? (start=0, stop=args[0], step=1) : (start=args[0], stop=args[1], step=args[2]==null? 1:args[2]); for (var i=start,a=[]; step>0 ? i<=stop:i>=stop; i+=step){a.push(i)} return a },
		Unique :        function(a)   { return a.sort().filter( function(v,i,o){if(i>0 && v!==o[i-1]) return v;}); },
		Log10 :         function(a)   { Math.log(arg) / 2.302585092994046;  },// Math.LN10;
    Sum :           function(a)   { return a.reduce( function(a,b){return a+b;} );},
    toArgsArray :   function(a)   { if( !(a instanceof Array) ) {a=this.Values(arguments)} return a;},
    // emulates PHP'S file_get_contents; makes a sync http-call and return the contents; @params: url, method
    getFileOld :    function(url,m) { var x = this.newXhrObj; if(!x) return new Error('no XMLHttpRequest-Object');if (!(/^http/).test(url)) { /* no transfer protocol specified -> relative url?*/ url = window.location.href + '/' + url;} x.open(m||"GET", url, false); x.send(null); return x.responseText; },
    //getFile: @params url=fileurl,m=POST|GET,fn=callback function, fndirect=false|true -> direct fn binding,i.e. deal with status codes within the function
    //Exmpl. is.getFile("res/data/tags.json", function(){console.log(arguments);} )
    getFile :       function(url,m,fn,fnm) {m=m||"GET";if(m&&m.constructor !== String){fn=m; m="GET";}; var x = this.newXhrObj; if(!x) return new Error('no XMLHttpRequest-Object');if (!(/^http/).test(url)) { /* no transfer protocol specified -> relative url?*/var l=window.location; url =l.origin+l.pathname+url;} x.open(m||"GET", url, !!fn);if(fn)x.onreadystatechange=fnm?fn:function(){if (x.readyState==4 && x.status==200){fn.apply(this, [x.responseText].concat(arguments));}}; x.send(null); return x.responseText; },
    getDir :        function(url,m) { var x = this.newXhrObj; if(!x) return new Error('no XMLHttpRequest-Object'); x.open(m||"GET", url, false); x.send(null); return x; },
    file_get_contents:function(u,m) {return getFile(u,m);},
    areTypeOf :     function(t,a) { a = toArgsArray(a); return !!this.Sum(a.map(function(v){return typeof v === t || v instanceof t;})); }, //returns true if all elements are of a specified type 't'; php function: are_type_of
    //modified, from phpjs; @params: (name, value, expires, path, domain, secure)
    toCookie :      function (n,v,e,p,d,s) {v = encodeURIComponent(v);if (typeof e === 'string' && (/^\d+$/).test(e)) {e = parseInt(e, 10);}if (e instanceof Date) {e = e.toGMTString();} else if (typeof(e) === 'number') {e = (new Date(e * 1e3)).toGMTString();}var r = [n + '=' + v],s = {},i = '';s = {e: e,p: p,d: d}; for (i in s) {if (s.hasOwnProperty(i)){s[i] && r.push(i + '=' + s[i]);}}s && r.push('secure'), this.window.document.cookie = r.join(";")},
    //getBase64Img returns DOM-Image element's image data as base64 string; not CORS issue will raise DOM exceptions e.g. SECURITY_ERR: DOM Exception 18; o:HTMLImgElement, [t:type of the image e.g. png, h:whether a data-header should be returned e.g. data:image...] 
    getBase64Img :  function(o,t,h) { var c = document.createElement('canvas'); c.width = o.width; c.height = o.height; /*copy to canvas->*/var cx = c.getContext('2d');cx.drawImage(o,0,0); var ext = (t||this.FileExt(o.src)||'png'); var db64 = c.toDataURL("image/"+ext ); return h ? db64.replace(/^data:image\/[a-z]+;base64,/, '') : db64; },
    //returns Boolean true if the interval-parameter (int [msec]) is greater or equal the passed time since the last call.
    timePassed :    function(i){var n=Date.now, _tlast = n(), _i=i; return function(i){var bdiff = (i||_i) <= (n()-_tlast); _tlast = n(); return bdiff;}; },
    dbg :           function(){var c = arguments.callee.caller, cfn = c.name, cargs = c.arguments; console.log(this, cfn, cargs ,'arguments:', arguments); return arguments;}, //common listener template, attached to event handlers for dbg
    get log()       { for(var i=0; i<_log.length;i++){console.log(i,_log[i]);} return _log; }, //e.g. true === is.log.indexOf('myentry')
    set log()       {  _log.push(arguments[0]); console.log( arguments );  }, //e.g. is.log = 'log this fu bar'; is.log = 'another log entry'
  };
})();

//check if the 'is' object already exists, if so traverse the prototoype chain till we can attach a new 'is'-Object
if( this && this.is && this.is.constructor.toString().match(/Object|Function/) ){
	var _ref = this.is, _pref=null;
	for(var i =0;i<10; i++){ //no do-while ust to be on the save side
		if( !_ref['__proto__'] ){
			_pref['__proto__'] = _is;
			delete _is;
			delete _ref;
			delete _pref;
			break;
		}else{
			_pref = _ref;
			_ref = _ref['__proto__'];
		}
	}
}else{	//expose to current scope
	this.is = _is;
	delete _is;
}


//navigator.is = window.is;

/* experimental: 
TODO:
implement worker-based 'settimeout'; normal settimeout uses 'eval'; settimeout is not executed in a parallel thread, but uses a timer comparison and is executed in the current running stack
*/