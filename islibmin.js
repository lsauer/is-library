is=(function(){return{xhrStatus:{},Debug:false,XMLHTTP:["Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"],get AdobeAIRfunction(){return(navigator.userAgent.indexOf("AdobeAIR")>=0)?true:false},get Airfunction(){return this.AdobeAIR},get Khtmlfunction(){return(navigator.appVersion.indexOf("Konqueror")>=0)?parseFloat(navigator.appVersion):false},get WebKitfunction(){return parseFloat(navigator.userAgent.split("WebKit/")[1])||false},get Chromefunction(){return this.WebKit},get Operafunction(){return navigator.userAgent.indexOf("Opera")>=0?true:false},get OperaNewfunction(){return parseFloat(navigator.appVersion)>=9.6?(parseFloat(navigator.userAgent.split("Version/")[1])||parseFloat(navigator.appVersion)):false},get Prestofunction(){return this.Opera},get IEfunction(){return document.all&&!this.Opera?parseFloat(navigator.appVersion.split("MSIE ")[1])||false:false},get FFfunction(){return navigator.userAgent.indexOf("Gecko")>=0&&!this.Khtml&&!this.WebKit},get Geckofunction(){return this.FF},get Macfunction(){return navigator.appVersion.indexOf("Macintosh")>=0},get Winfunction(){return navigator.appVersion.indexOf("Win")>=0},get X11function(){return navigator.appVersion.indexOf("X11")>=0},get Unixfunction(){return this.X11},get Linuxfunction(){return navigator.appVersion.indexOf("Linux")>=0},get ChromeOSfunction(){return/Google/i.test(navigator.appVersion)},get iOSfunction(){return/iPod|iPhone|iPad/i.test(navigator.userAgent)},get Wiifunction(){return typeof opera!="undefined"&&opera.wiiremote},get XHRActiveXfunction(){return this.IE&&window.location.protocol==="file:"},get QuirksModefunction(){return document.compatMode==="BackCompat"},set XHRStatusfunction(a){this.xhrStatus=a},get XHRStatusOKfunction(){var a=this.xhrStatus;return(a.status>=200&&a.status<300)||a.status==304||a.status==1223||false},get newXhrObjfunction(){if(typeof XMLHttpRequest!=="undefined"){return new XMLHttpRequest}else{for(var a=3;a--;){try{var c=new ActiveXObject(this.XMLHTTP[a]);return c}catch(b){is.Warn(b)}}}},set Exitfunction(a){throw a},Error:function(b,a){if(this.Debug){throw b}else{console.error(b)}return typeof a!=="undefined"?a:b},Warn:function(b,a){if(this.Debug){console.warn(b)}return typeof a!=="undefined"?a:b},Array:function(b){return b instanceof Array},ObjSame:function(d,c){return d.constructor===c.constructor},String:function(a){return typeof a==="string"},Object:function(a){return a!==null&&a instanceof Object},Empty:function(a){if(typeof a==="undefined"){return undefined}else{return !Boolean(a)}},Void:function(a){return !Boolean(a)},OfValue:function(a){return Boolean(a)},IsSet:function(a){return typeof a!=="undefined"&&Boolean(a)},Number:function(a){if(typeof a==="undefined"){return undefined}if(typeof a==="number"&&a!==Number.NaN&&Math.abs(a)!==Infinity){return true}else{false}},Between:function(e,d,c){e=parseFloat(e);if(!this.Number(e)){return undefined}return d<e&&e<c},NoElements:function(b){for(var c=cnt=0;c<b.length;cnt+=!this.Void(b[c++])){}return cnt},}})();