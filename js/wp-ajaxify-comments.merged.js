/*!
 * jsUri
 * https://github.com/derek-watson/jsUri
 *
 * Copyright 2013, Derek Watson
 * Released under the MIT license.
 *
 * Includes parseUri regular expressions
 * http://blog.stevenlevithan.com/archives/parseuri
 * Copyright 2007, Steven Levithan
 * Released under the MIT license.
 */

 /*globals define, module */

 (function(global) {

    var re = {
      starts_with_slashes: /^\/+/,
      ends_with_slashes: /\/+$/,
      pluses: /\+/g,
      query_separator: /[&;]/,
      uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };
  
    /**
     * Define forEach for older js environments
     * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
     */
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
  
        if (this == null) {
          throw new TypeError(' this is null or not defined');
        }
  
        var O = Object(this);
        var len = O.length >>> 0;
  
        if (typeof callback !== "function") {
          throw new TypeError(callback + ' is not a function');
        }
  
        if (arguments.length > 1) {
          T = thisArg;
        }
  
        k = 0;
  
        while (k < len) {
          var kValue;
          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }
          k++;
        }
      };
    }
  
    /**
     * unescape a query param value
     * @param  {string} s encoded value
     * @return {string}   decoded value
     */
    function decode(s) {
      if (s) {
          s = s.toString().replace(re.pluses, '%20');
          s = decodeURIComponent(s);
      }
      return s;
    }
  
    /**
     * Breaks a uri string down into its individual parts
     * @param  {string} str uri
     * @return {object}     parts
     */
    function parseUri(str) {
      var parser = re.uri_parser;
      var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
      var m = parser.exec(str || '');
      var parts = {};
  
      parserKeys.forEach(function(key, i) {
        parts[key] = m[i] || '';
      });
  
      return parts;
    }
  
    /**
     * Breaks a query string down into an array of key/value pairs
     * @param  {string} str query
     * @return {array}      array of arrays (key/value pairs)
     */
    function parseQuery(str) {
      var i, ps, p, n, k, v, l;
      var pairs = [];
  
      if (typeof(str) === 'undefined' || str === null || str === '') {
        return pairs;
      }
  
      if (str.indexOf('?') === 0) {
        str = str.substring(1);
      }
  
      ps = str.toString().split(re.query_separator);
  
      for (i = 0, l = ps.length; i < l; i++) {
        p = ps[i];
        n = p.indexOf('=');
  
        if (n !== 0) {
          k = decode(p.substring(0, n));
          v = decode(p.substring(n + 1));
          pairs.push(n === -1 ? [p, null] : [k, v]);
        }
  
      }
      return pairs;
    }
  
    /**
     * Creates a new Uri object
     * @constructor
     * @param {string} str
     */
    function Uri(str) {
      this.uriParts = parseUri(str);
      this.queryPairs = parseQuery(this.uriParts.query);
      this.hasAuthorityPrefixUserPref = null;
    }
  
    /**
     * Define getter/setter methods
     */
    ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
      Uri.prototype[key] = function(val) {
        if (typeof val !== 'undefined') {
          this.uriParts[key] = val;
        }
        return this.uriParts[key];
      };
    });
  
    /**
     * if there is no protocol, the leading // can be enabled or disabled
     * @param  {Boolean}  val
     * @return {Boolean}
     */
    Uri.prototype.hasAuthorityPrefix = function(val) {
      if (typeof val !== 'undefined') {
        this.hasAuthorityPrefixUserPref = val;
      }
  
      if (this.hasAuthorityPrefixUserPref === null) {
        return (this.uriParts.source.indexOf('//') !== -1);
      } else {
        return this.hasAuthorityPrefixUserPref;
      }
    };
  
    Uri.prototype.isColonUri = function (val) {
      if (typeof val !== 'undefined') {
        this.uriParts.isColonUri = !!val;
      } else {
        return !!this.uriParts.isColonUri;
      }
    };
  
    /**
     * Serializes the internal state of the query pairs
     * @param  {string} [val]   set a new query string
     * @return {string}         query string
     */
    Uri.prototype.query = function(val) {
      var s = '', i, param, l;
  
      if (typeof val !== 'undefined') {
        this.queryPairs = parseQuery(val);
      }
  
      for (i = 0, l = this.queryPairs.length; i < l; i++) {
        param = this.queryPairs[i];
        if (s.length > 0) {
          s += '&';
        }
        if (param[1] === null) {
          s += param[0];
        } else {
          s += param[0];
          s += '=';
          if (typeof param[1] !== 'undefined') {
            s += encodeURIComponent(param[1]);
          }
        }
      }
      return s.length > 0 ? '?' + s : s;
    };
  
    /**
     * returns the first query param value found for the key
     * @param  {string} key query key
     * @return {string}     first value found for key
     */
    Uri.prototype.getQueryParamValue = function (key) {
      var param, i, l;
      for (i = 0, l = this.queryPairs.length; i < l; i++) {
        param = this.queryPairs[i];
        if (key === param[0]) {
          return param[1];
        }
      }
    };
  
    /**
     * returns an array of query param values for the key
     * @param  {string} key query key
     * @return {array}      array of values
     */
    Uri.prototype.getQueryParamValues = function (key) {
      var arr = [], i, param, l;
      for (i = 0, l = this.queryPairs.length; i < l; i++) {
        param = this.queryPairs[i];
        if (key === param[0]) {
          arr.push(param[1]);
        }
      }
      return arr;
    };
  
    /**
     * removes query parameters
     * @param  {string} key     remove values for key
     * @param  {val}    [val]   remove a specific value, otherwise removes all
     * @return {Uri}            returns self for fluent chaining
     */
    Uri.prototype.deleteQueryParam = function (key, val) {
      var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;
  
      for (i = 0, l = this.queryPairs.length; i < l; i++) {
  
        param = this.queryPairs[i];
        keyMatchesFilter = decode(param[0]) === decode(key);
        valMatchesFilter = param[1] === val;
  
        if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
          arr.push(param);
        }
      }
  
      this.queryPairs = arr;
  
      return this;
    };
  
    /**
     * adds a query parameter
     * @param  {string}  key        add values for key
     * @param  {string}  val        value to add
     * @param  {integer} [index]    specific index to add the value at
     * @return {Uri}                returns self for fluent chaining
     */
    Uri.prototype.addQueryParam = function (key, val, index) {
      if (arguments.length === 3 && index !== -1) {
        index = Math.min(index, this.queryPairs.length);
        this.queryPairs.splice(index, 0, [key, val]);
      } else if (arguments.length > 0) {
        this.queryPairs.push([key, val]);
      }
      return this;
    };
  
    /**
     * test for the existence of a query parameter
     * @param  {string}  key        check values for key
     * @return {Boolean}            true if key exists, otherwise false
     */
    Uri.prototype.hasQueryParam = function (key) {
      var i, len = this.queryPairs.length;
      for (i = 0; i < len; i++) {
        if (this.queryPairs[i][0] == key)
          return true;
      }
      return false;
    };
  
    /**
     * replaces query param values
     * @param  {string} key         key to replace value for
     * @param  {string} newVal      new value
     * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
     * @return {Uri}                returns self for fluent chaining
     */
    Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
      var index = -1, len = this.queryPairs.length, i, param;
  
      if (arguments.length === 3) {
        for (i = 0; i < len; i++) {
          param = this.queryPairs[i];
          if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          this.deleteQueryParam(key, decode(oldVal)).addQueryParam(key, newVal, index);
        }
      } else {
        for (i = 0; i < len; i++) {
          param = this.queryPairs[i];
          if (decode(param[0]) === decode(key)) {
            index = i;
            break;
          }
        }
        this.deleteQueryParam(key);
        this.addQueryParam(key, newVal, index);
      }
      return this;
    };
  
    /**
     * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
     */
    ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
      var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
      Uri.prototype[method] = function(val) {
        this[key](val);
        return this;
      };
    });
  
    /**
     * Scheme name, colon and doubleslash, as required
     * @return {string} http:// or possibly just //
     */
    Uri.prototype.scheme = function() {
      var s = '';
  
      if (this.protocol()) {
        s += this.protocol();
        if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
          s += ':';
        }
        s += '//';
      } else {
        if (this.hasAuthorityPrefix() && this.host()) {
          s += '//';
        }
      }
  
      return s;
    };
  
    /**
     * Same as Mozilla nsIURI.prePath
     * @return {string} scheme://user:password@host:port
     * @see  https://developer.mozilla.org/en/nsIURI
     */
    Uri.prototype.origin = function() {
      var s = this.scheme();
  
      if (this.userInfo() && this.host()) {
        s += this.userInfo();
        if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
          s += '@';
        }
      }
  
      if (this.host()) {
        s += this.host();
        if (this.port() || (this.path() && this.path().substr(0, 1).match(/[0-9]/))) {
          s += ':' + this.port();
        }
      }
  
      return s;
    };
  
    /**
     * Adds a trailing slash to the path
     */
    Uri.prototype.addTrailingSlash = function() {
      var path = this.path() || '';
  
      if (path.substr(-1) !== '/') {
        this.path(path + '/');
      }
  
      return this;
    };
  
    /**
     * Serializes the internal state of the Uri object
     * @return {string}
     */
    Uri.prototype.toString = function() {
      var path, s = this.origin();
  
      if (this.isColonUri()) {
        if (this.path()) {
          s += ':'+this.path();
        }
      } else if (this.path()) {
        path = this.path();
        if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
          s += '/';
        } else {
          if (s) {
            s.replace(re.ends_with_slashes, '/');
          }
          path = path.replace(re.starts_with_slashes, '/');
        }
        s += path;
      } else {
        if (this.host() && (this.query().toString() || this.anchor())) {
          s += '/';
        }
      }
      if (this.query().toString()) {
        s += this.query().toString();
      }
  
      if (this.anchor()) {
        if (this.anchor().indexOf('#') !== 0) {
          s += '#';
        }
        s += this.anchor();
      }
  
      return s;
    };
  
    /**
     * Clone a Uri object
     * @return {Uri} duplicate copy of the Uri
     */
    Uri.prototype.clone = function() {
      return new Uri(this.toString());
    };
  
    /**
     * export via AMD or CommonJS, otherwise leak a global
     */
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return Uri;
      });
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = Uri;
    } else {
      global.Uri = Uri;
    }
  }(this));
  
/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
	/*jshint eqeqeq:false curly:false latedef:false */
	"use strict";
	
		function setup($) {
			$.fn._fadeIn = $.fn.fadeIn;
	
			var noOp = $.noop || function() {};
	
			// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
			// confusing userAgent strings on Vista)
			var msie = /MSIE/.test(navigator.userAgent);
			var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
			var mode = document.documentMode || 0;
			var setExpr = $.isFunction( document.createElement('div').style.setExpression );
	
			// global $ methods for blocking/unblocking the entire page
			$.blockUI   = function(opts) { install(window, opts); };
			$.unblockUI = function(opts) { remove(window, opts); };
	
			// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
			$.growlUI = function(title, message, timeout, onClose) {
				var $m = $('<div class="growlUI"></div>');
				if (title) $m.append('<h1>'+title+'</h1>');
				if (message) $m.append('<h2>'+message+'</h2>');
				if (timeout === undefined) timeout = 3000;
	
				// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
				var callBlock = function(opts) {
					opts = opts || {};
	
					$.blockUI({
						message: $m,
						fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
						fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
						timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
						centerY: false,
						showOverlay: false,
						onUnblock: onClose,
						css: $.blockUI.defaults.growlCSS
					});
				};
	
				callBlock();
				var nonmousedOpacity = $m.css('opacity');
				$m.mouseover(function() {
					callBlock({
						fadeIn: 0,
						timeout: 30000
					});
	
					var displayBlock = $('.blockMsg');
					displayBlock.stop(); // cancel fadeout if it has started
					displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
				}).mouseout(function() {
					$('.blockMsg').fadeOut(1000);
				});
				// End konapun additions
			};
	
			// plugin method for blocking element content
			$.fn.block = function(opts) {
				if ( this[0] === window ) {
					$.blockUI( opts );
					return this;
				}
				var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
				this.each(function() {
					var $el = $(this);
					if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
						return;
					$el.unblock({ fadeOut: 0 });
				});
	
				return this.each(function() {
					if ($.css(this,'position') == 'static') {
						this.style.position = 'relative';
						$(this).data('blockUI.static', true);
					}
					this.style.zoom = 1; // force 'hasLayout' in ie
					install(this, opts);
				});
			};
	
			// plugin method for unblocking element content
			$.fn.unblock = function(opts) {
				if ( this[0] === window ) {
					$.unblockUI( opts );
					return this;
				}
				return this.each(function() {
					remove(this, opts);
				});
			};
	
			$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!
	
			// override these in your code to change the default behavior and style
			$.blockUI.defaults = {
				// message displayed when blocking (use null for no message)
				message:  '<h1>Please wait...</h1>',
	
				title: null,		// title string; only used when theme == true
				draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)
	
				theme: false, // set to true to use with jQuery UI themes
	
				// styles for the message when blocking; if you wish to disable
				// these and use an external stylesheet then do this in your code:
				// $.blockUI.defaults.css = {};
				css: {
					padding:	0,
					margin:		0,
					width:		'30%',
					top:		'40%',
					left:		'35%',
					textAlign:	'center',
					color:		'#000',
					border:		'3px solid #aaa',
					backgroundColor:'#fff',
					cursor:		'wait'
				},
	
				// minimal style set used when themes are used
				themedCSS: {
					width:	'30%',
					top:	'40%',
					left:	'35%'
				},
	
				// styles for the overlay
				overlayCSS:  {
					backgroundColor:	'#000',
					opacity:			0.6,
					cursor:				'wait'
				},
	
				// style to replace wait cursor before unblocking to correct issue
				// of lingering wait cursor
				cursorReset: 'default',
	
				// styles applied when using $.growlUI
				growlCSS: {
					width:		'350px',
					top:		'10px',
					left:		'',
					right:		'10px',
					border:		'none',
					padding:	'5px',
					opacity:	0.6,
					cursor:		'default',
					color:		'#fff',
					backgroundColor: '#000',
					'-webkit-border-radius':'10px',
					'-moz-border-radius':	'10px',
					'border-radius':		'10px'
				},
	
				// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
				// (hat tip to Jorge H. N. de Vasconcelos)
				/*jshint scripturl:true */
				iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
	
				// force usage of iframe in non-IE browsers (handy for blocking applets)
				forceIframe: false,
	
				// z-index for the blocking overlay
				baseZ: 1000,
	
				// set these to true to have the message automatically centered
				centerX: true, // <-- only effects element blocking (page block controlled via css above)
				centerY: true,
	
				// allow body element to be stetched in ie6; this makes blocking look better
				// on "short" pages.  disable if you wish to prevent changes to the body height
				allowBodyStretch: true,
	
				// enable if you want key and mouse events to be disabled for content that is blocked
				bindEvents: true,
	
				// be default blockUI will supress tab navigation from leaving blocking content
				// (if bindEvents is true)
				constrainTabKey: true,
	
				// fadeIn time in millis; set to 0 to disable fadeIn on block
				fadeIn:  200,
	
				// fadeOut time in millis; set to 0 to disable fadeOut on unblock
				fadeOut:  400,
	
				// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
				timeout: 0,
	
				// disable if you don't want to show the overlay
				showOverlay: true,
	
				// if true, focus will be placed in the first available input field when
				// page blocking
				focusInput: true,
	
				// elements that can receive focus
				focusableElements: ':input:enabled:visible',
	
				// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
				// no longer needed in 2012
				// applyPlatformOpacityRules: true,
	
				// callback method invoked when fadeIn has completed and blocking message is visible
				onBlock: null,
	
				// callback method invoked when unblocking has completed; the callback is
				// passed the element that has been unblocked (which is the window object for page
				// blocks) and the options that were passed to the unblock call:
				//	onUnblock(element, options)
				onUnblock: null,
	
				// callback method invoked when the overlay area is clicked.
				// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
				onOverlayClick: null,
	
				// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
				quirksmodeOffsetHack: 4,
	
				// class name of the message block
				blockMsgClass: 'blockMsg',
	
				// if it is already blocked, then ignore it (don't unblock and reblock)
				ignoreIfBlocked: false
			};
	
			// private data and functions follow...
	
			var pageBlock = null;
			var pageBlockEls = [];
	
			function install(el, opts) {
				var css, themedCSS;
				var full = (el == window);
				var msg = (opts && opts.message !== undefined ? opts.message : undefined);
				opts = $.extend({}, $.blockUI.defaults, opts || {});
	
				if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
					return;
	
				opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
				css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
				if (opts.onOverlayClick)
					opts.overlayCSS.cursor = 'pointer';
	
				themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
				msg = msg === undefined ? opts.message : msg;
	
				// remove the current block (if there is one)
				if (full && pageBlock)
					remove(window, {fadeOut:0});
	
				// if an existing element is being used as the blocking content then we capture
				// its current place in the DOM (and current display style) so we can restore
				// it when we unblock
				if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
					var node = msg.jquery ? msg[0] : msg;
					var data = {};
					$(el).data('blockUI.history', data);
					data.el = node;
					data.parent = node.parentNode;
					data.display = node.style.display;
					data.position = node.style.position;
					if (data.parent)
						data.parent.removeChild(node);
				}
	
				$(el).data('blockUI.onUnblock', opts.onUnblock);
				var z = opts.baseZ;
	
				// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
				// layer1 is the iframe layer which is used to supress bleed through of underlying content
				// layer2 is the overlay layer which has opacity and a wait cursor (by default)
				// layer3 is the message content that is displayed while blocking
				var lyr1, lyr2, lyr3, s;
				if (msie || opts.forceIframe)
					lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
				else
					lyr1 = $('<div class="blockUI" style="display:none"></div>');
	
				if (opts.theme)
					lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
				else
					lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
	
				if (opts.theme && full) {
					s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
					if ( opts.title ) {
						s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
					}
					s += '<div class="ui-widget-content ui-dialog-content"></div>';
					s += '</div>';
				}
				else if (opts.theme) {
					s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
					if ( opts.title ) {
						s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
					}
					s += '<div class="ui-widget-content ui-dialog-content"></div>';
					s += '</div>';
				}
				else if (full) {
					s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
				}
				else {
					s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
				}
				lyr3 = $(s);
	
				// if we have a message, style it
				if (msg) {
					if (opts.theme) {
						lyr3.css(themedCSS);
						lyr3.addClass('ui-widget-content');
					}
					else
						lyr3.css(css);
				}
	
				// style the overlay
				if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
					lyr2.css(opts.overlayCSS);
				lyr2.css('position', full ? 'fixed' : 'absolute');
	
				// make iframe layer transparent in IE
				if (msie || opts.forceIframe)
					lyr1.css('opacity',0.0);
	
				//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
				var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
				$.each(layers, function() {
					this.appendTo($par);
				});
	
				if (opts.theme && opts.draggable && $.fn.draggable) {
					lyr3.draggable({
						handle: '.ui-dialog-titlebar',
						cancel: 'li'
					});
				}
	
				// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
				var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
				if (ie6 || expr) {
					// give body 100% height
					if (full && opts.allowBodyStretch && $.support.boxModel)
						$('html,body').css('height','100%');
	
					// fix ie6 issue when blocked element has a border width
					if ((ie6 || !$.support.boxModel) && !full) {
						var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
						var fixT = t ? '(0 - '+t+')' : 0;
						var fixL = l ? '(0 - '+l+')' : 0;
					}
	
					// simulate fixed position
					$.each(layers, function(i,o) {
						var s = o[0].style;
						s.position = 'absolute';
						if (i < 2) {
							if (full)
								s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
							else
								s.setExpression('height','this.parentNode.offsetHeight + "px"');
							if (full)
								s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
							else
								s.setExpression('width','this.parentNode.offsetWidth + "px"');
							if (fixL) s.setExpression('left', fixL);
							if (fixT) s.setExpression('top', fixT);
						}
						else if (opts.centerY) {
							if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
							s.marginTop = 0;
						}
						else if (!opts.centerY && full) {
							var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
							var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
							s.setExpression('top',expression);
						}
					});
				}
	
				// show the message
				if (msg) {
					if (opts.theme)
						lyr3.find('.ui-widget-content').append(msg);
					else
						lyr3.append(msg);
					if (msg.jquery || msg.nodeType)
						$(msg).show();
				}
	
				if ((msie || opts.forceIframe) && opts.showOverlay)
					lyr1.show(); // opacity is zero
				if (opts.fadeIn) {
					var cb = opts.onBlock ? opts.onBlock : noOp;
					var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
					var cb2 = msg ? cb : noOp;
					if (opts.showOverlay)
						lyr2._fadeIn(opts.fadeIn, cb1);
					if (msg)
						lyr3._fadeIn(opts.fadeIn, cb2);
				}
				else {
					if (opts.showOverlay)
						lyr2.show();
					if (msg)
						lyr3.show();
					if (opts.onBlock)
						opts.onBlock.bind(lyr3)();
				}
	
				// bind key and mouse events
				bind(1, el, opts);
	
				if (full) {
					pageBlock = lyr3[0];
					pageBlockEls = $(opts.focusableElements,pageBlock);
					if (opts.focusInput)
						setTimeout(focus, 20);
				}
				else
					center(lyr3[0], opts.centerX, opts.centerY);
	
				if (opts.timeout) {
					// auto-unblock
					var to = setTimeout(function() {
						if (full)
							$.unblockUI(opts);
						else
							$(el).unblock(opts);
					}, opts.timeout);
					$(el).data('blockUI.timeout', to);
				}
			}
	
			// remove the block
			function remove(el, opts) {
				var count;
				var full = (el == window);
				var $el = $(el);
				var data = $el.data('blockUI.history');
				var to = $el.data('blockUI.timeout');
				if (to) {
					clearTimeout(to);
					$el.removeData('blockUI.timeout');
				}
				opts = $.extend({}, $.blockUI.defaults, opts || {});
				bind(0, el, opts); // unbind events
	
				if (opts.onUnblock === null) {
					opts.onUnblock = $el.data('blockUI.onUnblock');
					$el.removeData('blockUI.onUnblock');
				}
	
				var els;
				if (full) // crazy selector to handle odd field errors in ie6/7
					els = $('body').children().filter('.blockUI').add('body > .blockUI');
				else
					els = $el.find('>.blockUI');
	
				// fix cursor issue
				if ( opts.cursorReset ) {
					if ( els.length > 1 )
						els[1].style.cursor = opts.cursorReset;
					if ( els.length > 2 )
						els[2].style.cursor = opts.cursorReset;
				}
	
				if (full)
					pageBlock = pageBlockEls = null;
	
				if (opts.fadeOut) {
					count = els.length;
					els.stop().fadeOut(opts.fadeOut, function() {
						if ( --count === 0)
							reset(els,data,opts,el);
					});
				}
				else
					reset(els, data, opts, el);
			}
	
			// move blocking element back into the DOM where it started
			function reset(els,data,opts,el) {
				var $el = $(el);
				if ( $el.data('blockUI.isBlocked') )
					return;
	
				els.each(function(i,o) {
					// remove via DOM calls so we don't lose event handlers
					if (this.parentNode)
						this.parentNode.removeChild(this);
				});
	
				if (data && data.el) {
					data.el.style.display = data.display;
					data.el.style.position = data.position;
					data.el.style.cursor = 'default'; // #59
					if (data.parent)
						data.parent.appendChild(data.el);
					$el.removeData('blockUI.history');
				}
	
				if ($el.data('blockUI.static')) {
					$el.css('position', 'static'); // #22
				}
	
				if (typeof opts.onUnblock == 'function')
					opts.onUnblock(el,opts);
	
				// fix issue in Safari 6 where block artifacts remain until reflow
				var body = $(document.body), w = body.width(), cssW = body[0].style.width;
				body.width(w-1).width(w);
				body[0].style.width = cssW;
			}
	
			// bind/unbind the handler
			function bind(b, el, opts) {
				var full = el == window, $el = $(el);
	
				// don't bother unbinding if there is nothing to unbind
				if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
					return;
	
				$el.data('blockUI.isBlocked', b);
	
				// don't bind events when overlay is not in use or if bindEvents is false
				if (!full || !opts.bindEvents || (b && !opts.showOverlay))
					return;
	
				// bind anchors and inputs for mouse and key events
				var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
				if (b)
					$(document).bind(events, opts, handler);
				else
					$(document).unbind(events, handler);
	
			// former impl...
			//		var $e = $('a,:input');
			//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
			}
	
			// event handler to suppress keyboard/mouse events when blocking
			function handler(e) {
				// allow tab navigation (conditionally)
				if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
					if (pageBlock && e.data.constrainTabKey) {
						var els = pageBlockEls;
						var fwd = !e.shiftKey && e.target === els[els.length-1];
						var back = e.shiftKey && e.target === els[0];
						if (fwd || back) {
							setTimeout(function(){focus(back);},10);
							return false;
						}
					}
				}
				var opts = e.data;
				var target = $(e.target);
				if (target.hasClass('blockOverlay') && opts.onOverlayClick)
					opts.onOverlayClick(e);
	
				// allow events within the message content
				if (target.parents('div.' + opts.blockMsgClass).length > 0)
					return true;
	
				// allow events for content that is not being blocked
				return target.parents().children().filter('div.blockUI').length === 0;
			}
	
			function focus(back) {
				if (!pageBlockEls)
					return;
				var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
				if (e)
					e.focus();
			}
	
			function center(el, x, y) {
				var p = el.parentNode, s = el.style;
				var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
				var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
				if (x) s.left = l > 0 ? (l+'px') : '0';
				if (y) s.top  = t > 0 ? (t+'px') : '0';
			}
	
			function sz(el, p) {
				return parseInt($.css(el,p),10)||0;
			}
	
		}
	
	
		/*global define:true */
		if (typeof define === 'function' && define.amd && define.amd.jQuery) {
			define(['jquery'], setup);
		} else {
			setup(jQuery);
		}
	
	})();
/*! Idle Timer - v1.1.1 - 2020-06-25
* https://github.com/thorst/jquery-idletimer
* Copyright (c) 2020 Paul Irish; Licensed MIT */
/*
	mousewheel (deprecated) -> IE6.0, Chrome, Opera, Safari
	DOMMouseScroll (deprecated) -> Firefox 1.0
	wheel (standard) -> Chrome 31, Firefox 17, IE9, Firefox Mobile 17.0

	//No need to use, use DOMMouseScroll
	MozMousePixelScroll -> Firefox 3.5, Firefox Mobile 1.0

	//Events
	WheelEvent -> see wheel
	MouseWheelEvent -> see mousewheel
	MouseScrollEvent -> Firefox 3.5, Firefox Mobile 1.0
*/
(function ($) {

    $.idleTimer = function (firstParam, elem) {
        var opts;
        if ( typeof firstParam === "object" ) {
            opts = firstParam;
            firstParam = null;
        } else if (typeof firstParam === "number") {
            opts = { timeout: firstParam };
            firstParam = null;
        }

        // element to watch
        elem = elem || document;

        // defaults that are to be stored as instance props on the elem
        opts = $.extend({
            idle: false,                // indicates if the user is idle
            timeout: 30000,             // the amount of time (ms) before the user is considered idle
            events: "mousemove keydown wheel DOMMouseScroll mousewheel mousedown touchstart touchmove MSPointerDown MSPointerMove" // define active events
        }, opts);

        var jqElem = $(elem),
            obj = jqElem.data("idleTimerObj") || {},

            /* (intentionally not documented)
             * Toggles the idle state and fires an appropriate event.
             * @return {void}
             */
            toggleIdleState = function (e) {
                var obj = $.data(elem, "idleTimerObj") || {};

                // toggle the state
                obj.idle = !obj.idle;

                // store toggle state date time
                obj.olddate = +new Date();

                // create a custom event, with state and name space
                var event = $.Event((obj.idle ? "idle" : "active") + ".idleTimer");

                // trigger event on object with elem and copy of obj
                $(elem).trigger(event, [elem, $.extend({}, obj), e]);
            },
            /**
             * Handle event triggers
             * @return {void}
             * @method event
             * @static
             */
            handleEvent = function (e) {
                var obj = $.data(elem, "idleTimerObj") || {};

		// ignore writting to storage unless related to idleTimer
                if (e.type === "storage" && e.originalEvent.key !== obj.timerSyncId) {
                    return;
                }

                // this is already paused, ignore events for now
                if (obj.remaining != null) { return; }

                /*
                mousemove is kinda buggy, it can be triggered when it should be idle.
                Typically is happening between 115 - 150 milliseconds after idle triggered.
                @psyafter & @kaellis report "always triggered if using modal (jQuery ui, with overlay)"
                @thorst has similar issues on ios7 "after $.scrollTop() on text area"
                */
                if (e.type === "mousemove") {
                    // if coord are same, it didn't move
                    if (e.pageX === obj.pageX && e.pageY === obj.pageY) {
                        return;
                    }
                    // if coord don't exist how could it move
                    if (typeof e.pageX === "undefined" && typeof e.pageY === "undefined") {
                        return;
                    }
                    // under 200 ms is hard to do, and you would have to stop, as continuous activity will bypass this
                    var elapsed = (+new Date()) - obj.olddate;
                    if (elapsed < 200) {
                        return;
                    }
                }

                // clear any existing timeout
                clearTimeout(obj.tId);

                // if the idle timer is enabled, flip
                if (obj.idle) {
                    toggleIdleState(e);
                }

                // store when user was last active
                obj.lastActive = +new Date();

                // update mouse coord
                obj.pageX = e.pageX;
                obj.pageY = e.pageY;

                // sync lastActive
                if (e.type !== "storage" && obj.timerSyncId) {
                  if (typeof(localStorage) !== "undefined") {
                    localStorage.setItem(obj.timerSyncId, obj.lastActive);
                  }
                }

                // set a new timeout
                obj.tId = setTimeout(toggleIdleState, obj.timeout);
            },
            /**
             * Restore initial settings and restart timer
             * @return {void}
             * @method reset
             * @static
             */
            reset = function () {

                var obj = $.data(elem, "idleTimerObj") || {};

                // reset settings
                obj.idle = obj.idleBackup;
                obj.olddate = +new Date();
                obj.lastActive = obj.olddate;
                obj.remaining = null;

                // reset Timers
                clearTimeout(obj.tId);
                if (!obj.idle) {
                    obj.tId = setTimeout(toggleIdleState, obj.timeout);
                }

            },
            /**
             * Store remaining time, stop timer
             * You can pause from an idle OR active state
             * @return {void}
             * @method pause
             * @static
             */
            pause = function () {

                var obj = $.data(elem, "idleTimerObj") || {};

                // this is already paused
                if ( obj.remaining != null ) { return; }

                // define how much is left on the timer
                obj.remaining = obj.timeout - ((+new Date()) - obj.olddate);

                // clear any existing timeout
                clearTimeout(obj.tId);
            },
            /**
             * Start timer with remaining value
             * @return {void}
             * @method resume
             * @static
             */
            resume = function () {

                var obj = $.data(elem, "idleTimerObj") || {};

                // this isn't paused yet
                if ( obj.remaining == null ) { return; }

                // start timer
                if ( !obj.idle ) {
                    obj.tId = setTimeout(toggleIdleState, obj.remaining);
                }

                // clear remaining
                obj.remaining = null;
            },
            /**
             * Stops the idle timer. This removes appropriate event handlers
             * and cancels any pending timeouts.
             * @return {void}
             * @method destroy
             * @static
             */
            destroy = function () {

                var obj = $.data(elem, "idleTimerObj") || {};

                //clear any pending timeouts
                clearTimeout(obj.tId);

                //Remove data
                jqElem.removeData("idleTimerObj");

                //detach the event handlers
                jqElem.off("._idleTimer");
            },
            /**
            * Returns the time until becoming idle
            * @return {number}
            * @method remainingtime
            * @static
            */
            remainingtime = function () {

                var obj = $.data(elem, "idleTimerObj") || {};

                //If idle there is no time remaining
                if ( obj.idle ) { return 0; }

                //If its paused just return that
                if ( obj.remaining != null ) { return obj.remaining; }

                //Determine remaining, if negative idle didn't finish flipping, just return 0
                var remaining = obj.timeout - ((+new Date()) - obj.lastActive);
                if (remaining < 0) { remaining = 0; }

                //If this is paused return that number, else return current remaining
                return remaining;
            };


        // determine which function to call
        if (firstParam === null && typeof obj.idle !== "undefined") {
            // they think they want to init, but it already is, just reset
            reset();
            return jqElem;
        } else if (firstParam === null) {
            // they want to init
        } else if (firstParam !== null && typeof obj.idle === "undefined") {
            // they want to do something, but it isnt init
            // not sure the best way to handle this
            return false;
        } else if (firstParam === "destroy") {
            destroy();
            return jqElem;
        } else if (firstParam === "pause") {
            pause();
            return jqElem;
        } else if (firstParam === "resume") {
            resume();
            return jqElem;
        } else if (firstParam === "reset") {
            reset();
            return jqElem;
        } else if (firstParam === "getRemainingTime") {
            return remainingtime();
        } else if (firstParam === "getElapsedTime") {
            return (+new Date()) - obj.olddate;
        } else if (firstParam === "getLastActiveTime") {
            return obj.lastActive;
        } else if (firstParam === "isIdle") {
            return obj.idle;
        }

	// Test via a getter in the options object to see if the passive property is accessed
	// This isnt working in jquery, though is planned for 4.0
	// https://github.com/jquery/jquery/issues/2871
        /*var supportsPassive = false;
        try {
            var Popts = Object.defineProperty({}, "passive", {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, Popts);
        } catch (e) {}
	*/

        /* (intentionally not documented)
         * Handles a user event indicating that the user isn't idle. namespaced with internal idleTimer
         * @param {Event} event A DOM2-normalized event object.
         * @return {void}
         */
        jqElem.on((opts.events + " ").split(" ").join("._idleTimer ").trim(), function (e) {
            handleEvent(e);
        });
        //}, supportsPassive ? { passive: true } : false);

        if (opts.timerSyncId) {
            $(window).on("storage", handleEvent);
        }

        // Internal Object Properties, This isn't all necessary, but we
        // explicitly define all keys here so we know what we are working with
        obj = $.extend({}, {
            olddate : +new Date(),          // the last time state changed
            lastActive: +new Date(),       // the last time timer was active
            idle : opts.idle,               // current state
            idleBackup : opts.idle,         // backup of idle parameter since it gets modified
            timeout : opts.timeout,         // the interval to change state
            remaining : null,               // how long until state changes
            timerSyncId : opts.timerSyncId, // localStorage key to use for syncing this timer
            tId : null,                     // the idle timer setTimeout
            pageX : null,                   // used to store the mouse coord
            pageY : null
        });

        // set a timeout to toggle state. May wish to omit this in some situations
        if (!obj.idle) {
            obj.tId = setTimeout(toggleIdleState, obj.timeout);
        }

        // store our instance on the object
        $.data(elem, "idleTimerObj", obj);

        return jqElem;
    };

    // This allows binding to element
    $.fn.idleTimer = function (firstParam) {
        if (this[0]) {
            return $.idleTimer(firstParam, this[0]);
        }

        return this;
    };

})(jQuery);
/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
(function() {
  'use strict'

  var keyCounter = 0
  var allWaypoints = {}

  /* http://imakewebthings.com/waypoints/api/waypoint */
  function Waypoint(options) {
    if (!options) {
      throw new Error('No options passed to Waypoint constructor')
    }
    if (!options.element) {
      throw new Error('No element option passed to Waypoint constructor')
    }
    if (!options.handler) {
		console.log("options", options);
      throw new Error('No handler option passed to Waypoint constructor')
    }

    this.key = 'waypoint-' + keyCounter
    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options)
    this.element = this.options.element
    this.adapter = new Waypoint.Adapter(this.element)
    this.callback = options.handler
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
    this.enabled = this.options.enabled
    this.triggerPoint = null
    this.group = Waypoint.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    })
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)

    if (Waypoint.offsetAliases[this.options.offset]) {
      this.options.offset = Waypoint.offsetAliases[this.options.offset]
    }
    this.group.add(this)
    this.context.add(this)
    allWaypoints[this.key] = this
    keyCounter += 1
  }

  /* Private */
  Waypoint.prototype.queueTrigger = function(direction) {
    this.group.queueTrigger(this, direction)
  }

  /* Private */
  Waypoint.prototype.trigger = function(args) {
    if (!this.enabled) {
      return
    }
    if (this.callback) {
      this.callback.apply(this, args)
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy */
  Waypoint.prototype.destroy = function() {
    this.context.remove(this)
    this.group.remove(this)
    delete allWaypoints[this.key]
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable */
  Waypoint.prototype.disable = function() {
    this.enabled = false
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable */
  Waypoint.prototype.enable = function() {
    this.context.refresh()
    this.enabled = true
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/next */
  Waypoint.prototype.next = function() {
    return this.group.next(this)
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/previous */
  Waypoint.prototype.previous = function() {
    return this.group.previous(this)
  }

  /* Private */
  Waypoint.invokeAll = function(method) {
    var allWaypointsArray = []
    for (var waypointKey in allWaypoints) {
      allWaypointsArray.push(allWaypoints[waypointKey])
    }
    for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
      allWaypointsArray[i][method]()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy-all */
  Waypoint.destroyAll = function() {
    Waypoint.invokeAll('destroy')
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable-all */
  Waypoint.disableAll = function() {
    Waypoint.invokeAll('disable')
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable-all */
  Waypoint.enableAll = function() {
    Waypoint.Context.refreshAll()
    for (var waypointKey in allWaypoints) {
      allWaypoints[waypointKey].enabled = true
    }
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/refresh-all */
  Waypoint.refreshAll = function() {
    Waypoint.Context.refreshAll()
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-height */
  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-width */
  Waypoint.viewportWidth = function() {
    return document.documentElement.clientWidth
  }

  Waypoint.adapters = []

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    group: 'default',
    horizontal: false,
    offset: 0
  }

  Waypoint.offsetAliases = {
    'bottom-in-view': function() {
      return this.context.innerHeight() - this.adapter.outerHeight()
    },
    'right-in-view': function() {
      return this.context.innerWidth() - this.adapter.outerWidth()
    }
  }

  window.Waypoint = Waypoint
}())
;(function() {
  'use strict'

  function requestAnimationFrameShim(callback) {
    window.setTimeout(callback, 1000 / 60)
  }

  var keyCounter = 0
  var contexts = {}
  var Waypoint = window.Waypoint
  var oldWindowLoad = window.onload

  /* http://imakewebthings.com/waypoints/api/context */
  function Context(element) {
    this.element = element
    this.Adapter = Waypoint.Adapter
    this.adapter = new this.Adapter(element)
    this.key = 'waypoint-context-' + keyCounter
    this.didScroll = false
    this.didResize = false
    this.oldScroll = {
      x: this.adapter.scrollLeft(),
      y: this.adapter.scrollTop()
    }
    this.waypoints = {
      vertical: {},
      horizontal: {}
    }

    element.waypointContextKey = this.key
    contexts[element.waypointContextKey] = this
    keyCounter += 1
    if (!Waypoint.windowContext) {
      Waypoint.windowContext = true
      Waypoint.windowContext = new Context(window)
    }

    this.createThrottledScrollHandler()
    this.createThrottledResizeHandler()
  }

  /* Private */
  Context.prototype.add = function(waypoint) {
    var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
    this.waypoints[axis][waypoint.key] = waypoint
    this.refresh()
  }

  /* Private */
  Context.prototype.checkEmpty = function() {
    var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal)
    var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical)
    var isWindow = this.element == this.element.window
    if (horizontalEmpty && verticalEmpty && !isWindow) {
      this.adapter.off('.waypoints')
      delete contexts[this.key]
    }
  }

  /* Private */
  Context.prototype.createThrottledResizeHandler = function() {
    var self = this

    function resizeHandler() {
      self.handleResize()
      self.didResize = false
    }

    this.adapter.on('resize.waypoints', function() {
      if (!self.didResize) {
        self.didResize = true
        Waypoint.requestAnimationFrame(resizeHandler)
      }
    })
  }

  /* Private */
  Context.prototype.createThrottledScrollHandler = function() {
    var self = this
    function scrollHandler() {
      self.handleScroll()
      self.didScroll = false
    }

    this.adapter.on('scroll.waypoints', function() {
      if (!self.didScroll || Waypoint.isTouch) {
        self.didScroll = true
        Waypoint.requestAnimationFrame(scrollHandler)
      }
    })
  }

  /* Private */
  Context.prototype.handleResize = function() {
    Waypoint.Context.refreshAll()
  }

  /* Private */
  Context.prototype.handleScroll = function() {
    var triggeredGroups = {}
    var axes = {
      horizontal: {
        newScroll: this.adapter.scrollLeft(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left'
      },
      vertical: {
        newScroll: this.adapter.scrollTop(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up'
      }
    }

    for (var axisKey in axes) {
      var axis = axes[axisKey]
      var isForward = axis.newScroll > axis.oldScroll
      var direction = isForward ? axis.forward : axis.backward

      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey]
        if (waypoint.triggerPoint === null) {
          continue
        }
        var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
        var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
        var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
        var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
        if (crossedForward || crossedBackward) {
          waypoint.queueTrigger(direction)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
      }
    }

    for (var groupKey in triggeredGroups) {
      triggeredGroups[groupKey].flushTriggers()
    }

    this.oldScroll = {
      x: axes.horizontal.newScroll,
      y: axes.vertical.newScroll
    }
  }

  /* Private */
  Context.prototype.innerHeight = function() {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportHeight()
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerHeight()
  }

  /* Private */
  Context.prototype.remove = function(waypoint) {
    delete this.waypoints[waypoint.axis][waypoint.key]
    this.checkEmpty()
  }

  /* Private */
  Context.prototype.innerWidth = function() {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportWidth()
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerWidth()
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-destroy */
  Context.prototype.destroy = function() {
    var allWaypoints = []
    for (var axis in this.waypoints) {
      for (var waypointKey in this.waypoints[axis]) {
        allWaypoints.push(this.waypoints[axis][waypointKey])
      }
    }
    for (var i = 0, end = allWaypoints.length; i < end; i++) {
      allWaypoints[i].destroy()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-refresh */
  Context.prototype.refresh = function() {
    /*eslint-disable eqeqeq */
    var isWindow = this.element == this.element.window
    /*eslint-enable eqeqeq */
    var contextOffset = isWindow ? undefined : this.adapter.offset()
    var triggeredGroups = {}
    var axes

    this.handleScroll()
    axes = {
      horizontal: {
        contextOffset: isWindow ? 0 : contextOffset.left,
        contextScroll: isWindow ? 0 : this.oldScroll.x,
        contextDimension: this.innerWidth(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left',
        offsetProp: 'left'
      },
      vertical: {
        contextOffset: isWindow ? 0 : contextOffset.top,
        contextScroll: isWindow ? 0 : this.oldScroll.y,
        contextDimension: this.innerHeight(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up',
        offsetProp: 'top'
      }
    }

    for (var axisKey in axes) {
      var axis = axes[axisKey]
      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey]
        var adjustment = waypoint.options.offset
        var oldTriggerPoint = waypoint.triggerPoint
        var elementOffset = 0
        var freshWaypoint = oldTriggerPoint == null
        var contextModifier, wasBeforeScroll, nowAfterScroll
        var triggeredBackward, triggeredForward

        if (waypoint.element !== waypoint.element.window) {
          elementOffset = waypoint.adapter.offset()[axis.offsetProp]
        }

        if (typeof adjustment === 'function') {
          adjustment = adjustment.apply(waypoint)
        }
        else if (typeof adjustment === 'string') {
          adjustment = parseFloat(adjustment)
          if (waypoint.options.offset.indexOf('%') > - 1) {
            adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
          }
        }

        contextModifier = axis.contextScroll - axis.contextOffset
        waypoint.triggerPoint = Math.floor(elementOffset + contextModifier - adjustment)
        wasBeforeScroll = oldTriggerPoint < axis.oldScroll
        nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
        triggeredBackward = wasBeforeScroll && nowAfterScroll
        triggeredForward = !wasBeforeScroll && !nowAfterScroll

        if (!freshWaypoint && triggeredBackward) {
          waypoint.queueTrigger(axis.backward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
        else if (!freshWaypoint && triggeredForward) {
          waypoint.queueTrigger(axis.forward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
        else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
          waypoint.queueTrigger(axis.forward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
      }
    }

    Waypoint.requestAnimationFrame(function() {
      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers()
      }
    })

    return this
  }

  /* Private */
  Context.findOrCreateByElement = function(element) {
    return Context.findByElement(element) || new Context(element)
  }

  /* Private */
  Context.refreshAll = function() {
    for (var contextId in contexts) {
      contexts[contextId].refresh()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-find-by-element */
  Context.findByElement = function(element) {
    return contexts[element.waypointContextKey]
  }

  window.onload = function() {
    if (oldWindowLoad) {
      oldWindowLoad()
    }
    Context.refreshAll()
  }


  Waypoint.requestAnimationFrame = function(callback) {
    var requestFn = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      requestAnimationFrameShim
    requestFn.call(window, callback)
  }
  Waypoint.Context = Context
}())
;(function() {
  'use strict'

  function byTriggerPoint(a, b) {
    return a.triggerPoint - b.triggerPoint
  }

  function byReverseTriggerPoint(a, b) {
    return b.triggerPoint - a.triggerPoint
  }

  var groups = {
    vertical: {},
    horizontal: {}
  }
  var Waypoint = window.Waypoint

  /* http://imakewebthings.com/waypoints/api/group */
  function Group(options) {
    this.name = options.name
    this.axis = options.axis
    this.id = this.name + '-' + this.axis
    this.waypoints = []
    this.clearTriggerQueues()
    groups[this.axis][this.name] = this
  }

  /* Private */
  Group.prototype.add = function(waypoint) {
    this.waypoints.push(waypoint)
  }

  /* Private */
  Group.prototype.clearTriggerQueues = function() {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    }
  }

  /* Private */
  Group.prototype.flushTriggers = function() {
    for (var direction in this.triggerQueues) {
      var waypoints = this.triggerQueues[direction]
      var reverse = direction === 'up' || direction === 'left'
      waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
      for (var i = 0, end = waypoints.length; i < end; i += 1) {
        var waypoint = waypoints[i]
        if (waypoint.options.continuous || i === waypoints.length - 1) {
          waypoint.trigger([direction])
        }
      }
    }
    this.clearTriggerQueues()
  }

  /* Private */
  Group.prototype.next = function(waypoint) {
    this.waypoints.sort(byTriggerPoint)
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    var isLast = index === this.waypoints.length - 1
    return isLast ? null : this.waypoints[index + 1]
  }

  /* Private */
  Group.prototype.previous = function(waypoint) {
    this.waypoints.sort(byTriggerPoint)
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    return index ? this.waypoints[index - 1] : null
  }

  /* Private */
  Group.prototype.queueTrigger = function(waypoint, direction) {
    this.triggerQueues[direction].push(waypoint)
  }

  /* Private */
  Group.prototype.remove = function(waypoint) {
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    if (index > -1) {
      this.waypoints.splice(index, 1)
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/first */
  Group.prototype.first = function() {
    return this.waypoints[0]
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/last */
  Group.prototype.last = function() {
    return this.waypoints[this.waypoints.length - 1]
  }

  /* Private */
  Group.findOrCreate = function(options) {
    return groups[options.axis][options.name] || new Group(options)
  }

  Waypoint.Group = Group
}())
;(function() {
  'use strict'

  var $ = window.jQuery
  var Waypoint = window.Waypoint

  function JQueryAdapter(element) {
    this.$element = $(element)
  }

  $.each([
    'innerHeight',
    'innerWidth',
    'off',
    'offset',
    'on',
    'outerHeight',
    'outerWidth',
    'scrollLeft',
    'scrollTop'
  ], function(i, method) {
    JQueryAdapter.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments)
      return this.$element[method].apply(this.$element, args)
    }
  })

  $.each([
    'extend',
    'inArray',
    'isEmptyObject'
  ], function(i, method) {
    JQueryAdapter[method] = $[method]
  })

  Waypoint.adapters.push({
    name: 'jquery',
    Adapter: JQueryAdapter
  })
  Waypoint.Adapter = JQueryAdapter
}())
;(function() {
  'use strict'

  var Waypoint = window.Waypoint

  function createExtension(framework) {
    return function() {
      var waypoints = []
      var overrides = arguments[0]

      if (framework.isFunction(arguments[0])) {
        overrides = framework.extend({}, arguments[1])
        overrides.handler = arguments[0]
      }

      this.each(function() {
        var options = framework.extend({}, overrides, {
          element: this
        })
        if (typeof options.context === 'string') {
          options.context = framework(this).closest(options.context)[0]
        }
        waypoints.push(new Waypoint(options))
      })

      return waypoints
    }
  }

  if (window.jQuery) {
    window.jQuery.fn.waypoint = createExtension(window.jQuery)
  }
  if (window.Zepto) {
    window.Zepto.fn.waypoint = createExtension(window.Zepto)
  }
}())
;
if (!window["WPAC"]) var WPAC = {};
WPAC._Options = WPAC._Options || {}; 

WPAC._BodyRegex = new RegExp("<body[^>]*>((.|\n|\r)*)</body>", "i");
WPAC._ExtractBody = function(html) {
	try {
		return jQuery("<div>"+WPAC._BodyRegex.exec(html)[1]+"</div>");
	} catch (e) {
		return false;
	}
}

WPAC._TitleRegex = new RegExp("<title[^>]*>(.*?)<\\/title>", "im");
WPAC._ExtractTitle = function(html) {
	try {
		return WPAC._TitleRegex.exec(html)[1];
	} catch (e) {
		return false;
	}
}

WPAC._ShowMessage = function (message, type) {

	var top = WPAC._Options.popupMarginTop + (jQuery("#wpadminbar").outerHeight() || 0);

	var backgroundColor = WPAC._Options.popupBackgroundColorLoading;
	var textColor = WPAC._Options.popupTextColorLoading;
	if (type == "error") {
		backgroundColor = WPAC._Options.popupBackgroundColorError;
		textColor = WPAC._Options.popupTextColorError;
	} else if (type == "success") {
		backgroundColor = WPAC._Options.popupBackgroundColorSuccess;
		textColor = WPAC._Options.popupTextColorSuccess;
	}
	
	jQuery.blockUI({ 
		message: message, 
		fadeIn: WPAC._Options.popupFadeIn, 
		fadeOut: WPAC._Options.popupFadeOut, 
		timeout:(type == "loading") ? 0 : WPAC._Options.popupTimeout,
		centerY: false,
		centerX: true,
		showOverlay: (type == "loading"),
		css: { 
			width: WPAC._Options.popupWidth + "%",
			left: ((100-WPAC._Options.popupWidth)/2) + "%",
			top: top + "px",
			border: "none", 
			padding: WPAC._Options.popupPadding + "px", 
			backgroundColor: backgroundColor, 
			"-webkit-border-radius": WPAC._Options.popupCornerRadius + "px",
			"-moz-border-radius": WPAC._Options.popupCornerRadius + "px",
			"border-radius": WPAC._Options.popupCornerRadius + "px",
			opacity: WPAC._Options.popupOpacity/100, 
			color: textColor,
			textAlign: WPAC._Options.popupTextAlign,
			cursor: (type == "loading") ? "wait" : "default",
			"font-size": WPAC._Options.popupTextFontSize
		},
		overlayCSS:  { 
			backgroundColor: "#000", 
			opacity: 0
		},
		baseZ: WPAC._Options.popupZindex
	}); 
	
}

WPAC._DebugErrorShown = false;
WPAC._Debug = function(level, message) {

	if (!WPAC._Options.debug) return;

	// Fix console.log.apply for IE9
	// see http://stackoverflow.com/a/5539378/516472
	if (Function.prototype.call && Function.prototype.call.bind && typeof window["console"] != "undefined" && console && typeof console.log == "object" && typeof window["console"][level].apply === "undefined") {
		console[level] = Function.prototype.call.bind(console[level], console);
	}

	if (typeof window["console"] === "undefined" || typeof window["console"][level] === "undefined" || typeof window["console"][level].apply === "undefined") {
		if (!WPAC._DebugErrorShown) alert("Unfortunately the console object is undefined or is not supported in your browser, debugging WP Ajaxify Comments is disabled! Please use Firebug, Google Chrome or Internet Explorer 9 or above with enabled Developer Tools (F12) for debugging WP Ajaxify Comments.");
		WPAC._DebugErrorShown = true;
		return;
	}

	var args = jQuery.merge(["[WP Ajaxify Comments] " + message], jQuery.makeArray(arguments).slice(2));
	console[level].apply(console, args);
}

WPAC._DebugSelector = function(elementType, selector, optional) {
	if (!WPAC._Options.debug) return;

	var element = jQuery(selector);
	if (!element.length) {
		WPAC._Debug(optional ? "info" : "error", "Search %s (selector: '%s')... Not found", elementType, selector);
	} else {
		WPAC._Debug("info", "Search %s (selector: '%s')... Found: %o", elementType, selector, element);
	}
}

WPAC._AddQueryParamStringToUrl = function(url, param, value) {
	return new Uri(url).replaceQueryParam(param, value).toString();
}

WPAC._LoadFallbackUrl = function(fallbackUrl) {

	WPAC._ShowMessage(WPAC._Options.textReloadPage, "loading");
	
	var url = WPAC._AddQueryParamStringToUrl(fallbackUrl, "WPACRandom", (new Date()).getTime());
	WPAC._Debug("info", "Something went wrong. Reloading page (URL: '%s')...", url);
	
	var reload = function() { location.href = url; };
	if (!WPAC._Options.debug) {
		reload();
	} else {
		WPAC._Debug("info", "Sleep for 5s to enable analyzing debug messages...");
		window.setTimeout(reload, 5000);
	}
}

WPAC._ScrollToAnchor = function(anchor, updateHash, scrollComplete) {
	scrollComplete = scrollComplete || function() {};
	var anchorElement = jQuery(anchor)
	if (anchorElement.length) {
		WPAC._Debug("info", "Scroll to anchor element %o (scroll speed: %s ms)...", anchorElement, WPAC._Options.scrollSpeed);
		var animateComplete = function() {
			if (updateHash) window.location.hash = anchor; 
			scrollComplete();
		}
		var scrollTargetTopOffset = anchorElement.offset().top
		if (jQuery(window).scrollTop() == scrollTargetTopOffset) {
			animateComplete();
		} else {
			jQuery("html,body").animate({scrollTop: scrollTargetTopOffset}, {
				duration: WPAC._Options.scrollSpeed,
				complete: animateComplete
			});
		}
		return true;
	} else {
		WPAC._Debug("error", "Anchor element not found (selector: '%s')", anchor);
		return false;
	}
}

WPAC._UpdateUrl= function(url) {
	if (url.split("#")[0] == window.location.href.split("#")[0]) {
		return;
	}
	if (window.history.replaceState) {
		window.history.replaceState({}, window.document.title, url);
	} else {
		WPAC._Debug("info", "Browser does not support window.history.replaceState() to update the URL without reloading the page", anchor);
	}
}

WPAC._ReplaceComments = function(data, commentUrl, useFallbackUrl, formData, formFocus, selectorCommentsContainer, selectorCommentForm, selectorRespondContainer, beforeSelectElements, beforeUpdateComments, afterUpdateComments) {
	
	var fallbackUrl = useFallbackUrl ? WPAC._AddQueryParamStringToUrl(commentUrl, "WPACFallback", "1") : commentUrl;
	
	var oldCommentsContainer = jQuery(selectorCommentsContainer);
	if (!oldCommentsContainer.length) {
		WPAC._Debug("error", "Comment container on current page not found (selector: '%s')", selectorCommentsContainer);
		WPAC._LoadFallbackUrl(fallbackUrl);
		return false;
	}
	
	var extractedBody = WPAC._ExtractBody(data);
	if (extractedBody === false) {
		WPAC._Debug("error", "Unsupported server response, unable to extract body (data: '%s')", data);
		WPAC._LoadFallbackUrl(fallbackUrl);
		return false;
	}
	
	beforeSelectElements(extractedBody);
	
	var newCommentsContainer = extractedBody.find(selectorCommentsContainer);
	if (!newCommentsContainer.length) {
		WPAC._Debug("error", "Comment container on requested page not found (selector: '%s')", selectorCommentsContainer);
		WPAC._LoadFallbackUrl(fallbackUrl);
		return false;
	}

	beforeUpdateComments(extractedBody, commentUrl);

	// Update title
	var extractedTitle = WPAC._ExtractTitle(data);
	if (extractedBody !== false) 
		// Decode HTML entities (see http://stackoverflow.com/a/5796744)
		document.title = jQuery('<textarea />').html(extractedTitle).text(); 
	
	// Update comments container
	oldCommentsContainer.replaceWith(newCommentsContainer);
	
	if (WPAC._Options.commentsEnabled) {
	
		var form = jQuery(selectorCommentForm);
		if (form.length) {
	
			// Replace comment form (for spam protection plugin compatibility) if comment form is not nested in comments container
			// If comment form is nested in comments container comment form has already been replaced
			if (!form.parents(selectorCommentsContainer).length) {
	
				WPAC._Debug("info", "Replace comment form...");
				var newCommentForm = extractedBody.find(selectorCommentForm);
				if (newCommentForm.length == 0) {
					WPAC._Debug("error", "Comment form on requested page not found (selector: '%s')", selectorCommentForm);
					WPAC._LoadFallbackUrl(fallbackUrl);
					return false;
				}
				form.replaceWith(newCommentForm);
			}
			
		} else {
	
			WPAC._Debug("info", "Try to re-inject comment form...");
		
			// "Re-inject" comment form, if comment form was removed by updating the comments container; could happen 
			// if theme support threaded/nested comments and form tag is not nested in comments container
			// -> Replace WordPress placeholder <div> (#wp-temp-form-div) with respond <div>
			var wpTempFormDiv = jQuery("#wp-temp-form-div");
			if (!wpTempFormDiv.length) {
				WPAC._Debug("error", "WordPress' #wp-temp-form-div container not found", selectorRespondContainer);
				WPAC._LoadFallbackUrl(fallbackUrl);
				return false;
			}
			var newRespondContainer = extractedBody.find(selectorRespondContainer);
			if (!newRespondContainer.length) {
				WPAC._Debug("error", "Respond container on requested page not found (selector: '%s')", selectorRespondContainer);
				WPAC._LoadFallbackUrl(fallbackUrl);
				return false;
			}
			wpTempFormDiv.replaceWith(newRespondContainer);
	
		}
	
		if (formData) {
			// Re-inject saved form data
			jQuery.each(formData, function(key, value) {
				var formElement = jQuery("[name='"+value.name+"']", selectorCommentForm);
				if (formElement.length != 1 || formElement.val()) return;
				formElement.val(value.value);
			});
		}
		if (formFocus) {
			// Reset focus
			var formElement = jQuery("[name='"+formFocus+"']", selectorCommentForm);
			if (formElement) formElement.focus();
		}

	}
		
	afterUpdateComments(extractedBody, commentUrl);

	return true;
}

WPAC._TestCrossDomainScripting = function(url) {
	if (url.indexOf("http") != 0) return false;
	var domain = window.location.protocol + "//" + window.location.host;
	return (url.indexOf(domain) != 0);
}

WPAC._TestFallbackUrl = function(url) {
	var url = new Uri(location.href); 
	return (url.getQueryParamValue("WPACFallback") && url.getQueryParamValue("WPACRandom"));
}

WPAC.AttachForm = function(options) {

	// Set default options
	options = jQuery.extend({
		selectorCommentForm: WPAC._Options.selectorCommentForm,
		selectorCommentPagingLinks: WPAC._Options.selectorCommentPagingLinks,
		beforeSelectElements: WPAC._Callbacks.beforeSelectElements,
		beforeSubmitComment: WPAC._Callbacks.beforeSubmitComment,
		afterPostComment: WPAC._Callbacks.afterPostComment,
		selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
		selectorRespondContainer: WPAC._Options.selectorRespondContainer,
		beforeUpdateComments: WPAC._Callbacks.beforeUpdateComments,
		afterUpdateComments: WPAC._Callbacks.afterUpdateComments,
		scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
		updateUrl: !WPAC._Options.disableUrlUpdate,
		selectorCommentLinks: WPAC._Options.selectorCommentLinks
	}, options || {});	

	if (WPAC._Options.debug && WPAC._Options.commentsEnabled) {
		WPAC._Debug("info", "Attach form...")
		WPAC._DebugSelector("comment form", options.selectorCommentForm);
		WPAC._DebugSelector("comments container",options.selectorCommentsContainer);
		WPAC._DebugSelector("respond container", options.selectorRespondContainer)
		WPAC._DebugSelector("comment paging links", options.selectorCommentPagingLinks, true);
		WPAC._DebugSelector("comment links", options.selectorCommentLinks, true);
	}
	
	options.beforeSelectElements(jQuery(document));
	
	// Get addHandler method
	if (jQuery(document).on) {
		// jQuery 1.7+
		var addHandler = function(event, selector, handler) {
			jQuery(document).on(event, selector, handler)
		}
	} else if (jQuery(document).delegate) {
		// jQuery 1.4.3+
		var addHandler = function(event, selector, handler) {
			jQuery(document).delegate(selector, event, handler)
		}
	} else {
		// jQuery 1.3+
		var addHandler = function(event, selector, handler) {
			jQuery(selector).live(event, handler)
		}
	}

	// Handle paging link clicks
	var pagingClickHandler = function(event) {
		var href = jQuery(this).attr("href");
		if (href) {
			event.preventDefault();
			WPAC.LoadComments(href, {
				selectorCommentForm: options.selectorCommentForm,
				selectorCommentsContainer: options.selectorCommentsContainer,
				selectorRespondContainer: options.selectorRespondContainer,
				beforeSelectElements: options.beforeSelectElements,
				beforeUpdateComments: options.beforeUpdateComments,
				afterUpdateComments: options.afterUpdateComments
			});
		}
	};
	addHandler("click", options.selectorCommentPagingLinks, pagingClickHandler);
	
	// Handle comment link clicks
	var linkClickHandler = function(event) {
		var element = jQuery(this);
		if (element.is(options.selectorCommentPagingLinks)) return; // skip if paging link was clicked 
		var href = element.attr("href");
		var anchor = "#" + (new Uri(href)).anchor();
		if (jQuery(anchor).length > 0) {
			if (options.updateUrl) WPAC._UpdateUrl(href);
			WPAC._ScrollToAnchor(anchor, options.updateUrl);
			event.preventDefault();
		}
	};
	addHandler("click", options.selectorCommentLinks, linkClickHandler);
	
	if (!WPAC._Options.commentsEnabled) return;
	
	// Handle form submit
	var formSubmitHandler = function (event) {
		var form = jQuery(this);

		options.beforeSubmitComment();

		var submitUrl = form.attr("action");

		// Cancel AJAX request if cross-domain scripting is detected
		if (WPAC._TestCrossDomainScripting(submitUrl)) {
			if (WPAC._Options.debug && !form.data("submitCrossDomain")) {
				WPAC._Debug("error", "Cross-domain scripting detected (submit url: '%s'), cancel AJAX request", submitUrl);
				WPAC._Debug("info", "Sleep for 5s to enable analyzing debug messages...");
				event.preventDefault();
				form.data("submitCrossDomain", true)
				window.setTimeout(function() { jQuery('#submit', form).remove(); form.submit(); }, 5000);
			}
			return;
		}
		
		// Stop default event handling
		event.preventDefault();
		
		// Test if form is already submitting
		if (form.data("WPAC_SUBMITTING")) {
			WPAC._Debug("info", "Cancel submit, form is already submitting (Form: %o)", form);
			return;
		}
		form.data("WPAC_SUBMITTING", true);

		// Show loading info
		WPAC._ShowMessage(WPAC._Options.textPostComment, "loading");

		var handleErrorResponse = function(data) {

			WPAC._Debug("info", "Comment has not been posted");
			WPAC._Debug("info", "Try to extract error message (selector: '%s')...", WPAC._Options.selectorErrorContainer);
			
			// Extract error message
			var extractedBody = WPAC._ExtractBody(data);
			if (extractedBody !== false) {
				var errorMessage = extractedBody.find(WPAC._Options.selectorErrorContainer);
				if (errorMessage.length) {
					errorMessage = errorMessage.html();
					WPAC._Debug("info", "Error message '%s' successfully extracted", errorMessage);
					WPAC._ShowMessage(errorMessage, "error");
					return;
				}
			}

			WPAC._Debug("error", "Error message could not be extracted, use error message '%s'.", WPAC._Options.textUnknownError);
			WPAC._ShowMessage(WPAC._Options.textUnknownError, "error");
		}
		
		var request = jQuery.ajax({
			url: submitUrl,
			type: "POST",
			data: form.serialize(),
			beforeSend: function(xhr){ xhr.setRequestHeader('X-WPAC-REQUEST', '1'); },
			complete: function(xhr, textStatus) { form.removeData("WPAC_SUBMITTING", true); },
			success: function (data) {

				// Test error state (WordPress >=4.1 does not return 500 status code if posting comment failed)
				if (request.getResponseHeader("X-WPAC-ERROR")) {
					WPAC._Debug("info", "Found error state X-WPAC-ERROR header.", commentUrl);
					handleErrorResponse(data);
					return;
				}
			
				WPAC._Debug("info", "Comment has been posted");

				// Get info from response header
				var commentUrl = request.getResponseHeader("X-WPAC-URL");
				WPAC._Debug("info", "Found comment URL '%s' in X-WPAC-URL header.", commentUrl);
				var unapproved = request.getResponseHeader("X-WPAC-UNAPPROVED");
				WPAC._Debug("info", "Found unapproved state '%s' in X-WPAC-UNAPPROVED", unapproved);

				options.afterPostComment(commentUrl, unapproved == '1');
				
				// Show success message
				WPAC._ShowMessage(unapproved == '1' ? WPAC._Options.textPostedUnapproved : WPAC._Options.textPosted, "success");

				// Replace comments (and return if replacing failed)
				if (!WPAC._ReplaceComments(data, commentUrl, false, {}, "", options.selectorCommentsContainer, options.selectorCommentForm, options.selectorRespondContainer, 
					options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) return;
				
				// Smooth scroll to comment url and update browser url
				if (commentUrl) {
						
					if (options.updateUrl)
						WPAC._UpdateUrl(commentUrl);
					
					if (options.scrollToAnchor) {
						var anchor = commentUrl.indexOf("#") >= 0 ? commentUrl.substr(commentUrl.indexOf("#")) : null;
						if (anchor) {
							WPAC._Debug("info", "Anchor '%s' extracted from comment URL '%s'", anchor, commentUrl);
							WPAC._ScrollToAnchor(anchor, options.updateUrl);
						}
					}
				}
				
			},
			error: function (jqXhr, textStatus, errorThrown) {

				// Test if loading comment url failed (due to cross site scripting error)
				if (jqXhr.status === 0 && jqXhr.responseText === "") {
					WPAC._Debug("error", "Comment seems to be posted, but loading comment update failed.");
					WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, "WPACFallback", "1"));
					return;
				}
			
				handleErrorResponse(jqXhr.responseText);
			}
		});
	};
	addHandler("submit", options.selectorCommentForm, formSubmitHandler)
}

WPAC._Initialized = false;
WPAC.Init = function() {

	// Test if plugin already has been initialized
	if (WPAC._Initialized) {
		WPAC._Debug("info", "Abort initialization (plugin already initialized)");
		return false;
	}
	WPAC._Initialized = true;
	
	// Assert that environment is set up correctly
	if (!WPAC._Options || !WPAC._Callbacks) {
		WPAC._Debug("error", "Something unexpected happened, initialization failed. Please try to reinstall the plugin.");
		return false;
	}

	// Debug infos
	WPAC._Debug("info", "Initializing version %s", WPAC._Options.version);

	// Debug infos
	if (WPAC._Options.debug) {
		if (!jQuery || !jQuery.fn || !jQuery.fn.jquery) {
			WPAC._Debug("error", "jQuery not found, abort initialization. Please try to reinstall the plugin.");
			return false;
		}
		WPAC._Debug("info", "Found jQuery %s", jQuery.fn.jquery);
		if (!jQuery.blockUI || !jQuery.blockUI.version) {
			WPAC._Debug("error", "jQuery blockUI not found, abort initialization. Please try to reinstall the plugin.");
			return false;
		}
		WPAC._Debug("info", "Found jQuery blockUI %s", jQuery.blockUI.version);
		if (!jQuery.idleTimer) {
			WPAC._Debug("error", "jQuery Idle Timer plugin not found, abort initialization. Please try to reinstall the plugin.");
			return false;
		}
		WPAC._Debug("info", "Found jQuery Idle Timer plugin");
	}

	if (WPAC._Options.selectorPostContainer) {
		WPAC._Debug("info", "Multiple comment form support enabled (selector: '%s')", WPAC._Options.selectorPostContainer);
		jQuery(WPAC._Options.selectorPostContainer).each(function(i,e) {
			var id = jQuery(e).attr("id");
			if (!id) {
				WPAC._Debug("info", "Skip post container element %o (ID not defined)", e);
				return
			}
			WPAC.AttachForm({
				selectorCommentForm: "#" + id + " " + WPAC._Options.selectorCommentForm,
				selectorCommentPagingLinks: "#" + id + " " + WPAC._Options.selectorCommentPagingLinks,
				selectorCommentsContainer: "#" + id + " " + WPAC._Options.selectorCommentsContainer,
				selectorRespondContainer: "#" + id + " " + WPAC._Options.selectorRespondContainer
			});	
		});
	} else {
		WPAC.AttachForm();
	}
	
	// Set up idle timer
	if (WPAC._Options.commentsEnabled && WPAC._Options.autoUpdateIdleTime > 0) {
		WPAC._Debug("info", "Auto updating comments enabled (idle time: %s)", WPAC._Options.autoUpdateIdleTime);
		WPAC._InitIdleTimer();
	}
	
	WPAC._Debug("info", "Initialization completed");

	return true;
}

WPAC._OnIdle = function() {
	WPAC.RefreshComments({ success: WPAC._InitIdleTimer, scrollToAnchor: false});
};

WPAC._InitIdleTimer = function() {
	if (WPAC._TestFallbackUrl(location.href)) {
		WPAC._Debug("error", "Fallback URL was detected (url: '%s'), cancel init idle timer", location.href);
		return;
	}
	
	jQuery(document).idleTimer("destroy");
	jQuery(document).idleTimer(WPAC._Options.autoUpdateIdleTime);
	jQuery(document).on("idle.idleTimer", WPAC._OnIdle);
}

WPAC.RefreshComments = function(options) {
	var url = location.href;
	
	if (WPAC._TestFallbackUrl(location.href)) {
		WPAC._Debug("error", "Fallback URL was detected (url: '%s'), cancel AJAX request", url);
		return false;   
	}
	
	return WPAC.LoadComments(url, options)
}

WPAC.LoadComments = function(url, options) {

	// Cancel AJAX request if cross-domain scripting is detected
	if (WPAC._TestCrossDomainScripting(url)) {
		WPAC._Debug("error", "Cross-domain scripting detected (url: '%s'), cancel AJAX request", url);
		return false;
	}

	// Convert boolean parameter (used in version <0.14.0)
	if (typeof(options) == "boolean")
		options = {scrollToAnchor: options}

	// Set default options
	options = jQuery.extend({
		scrollToAnchor: !WPAC._Options.disableScrollToAnchor,
		showLoadingInfo: true,
		updateUrl: !WPAC._Options.disableUrlUpdate,
		success: function() {},
		selectorCommentForm: WPAC._Options.selectorCommentForm,
		selectorCommentsContainer: WPAC._Options.selectorCommentsContainer,
		selectorRespondContainer: WPAC._Options.selectorRespondContainer,
		disableCache: WPAC._Options.disableCache,
		beforeSelectElements: WPAC._Callbacks.beforeSelectElements, 
		beforeUpdateComments: WPAC._Callbacks.beforeUpdateComments,
		afterUpdateComments: WPAC._Callbacks.afterUpdateComments,
	}, options || {});	
	
	// Save form data and focus
	var formData = jQuery(options.selectorCommentForm).serializeArray();
	var formFocus = (document.activeElement) ? jQuery("[name='"+document.activeElement.name+"']", options.selectorCommentForm).attr("name") : "";
	
	// Show loading info
	if (options.showLoadingInfo)
		WPAC._ShowMessage(WPAC._Options.textRefreshComments, "loading");

	if (options.disableCache) 
		url = WPAC._AddQueryParamStringToUrl(url, "WPACRandom", (new Date()).getTime());
		
	var request = jQuery.ajax({
		url: url,
		type: "GET",
		beforeSend: function(xhr){ xhr.setRequestHeader("X-WPAC-REQUEST", "1"); },
		success: function (data) {

			// Replace comments (and return if replacing failed)
			if (!WPAC._ReplaceComments(data, url, true, formData, formFocus, options.selectorCommentsContainer, options.selectorCommentForm, 
				options.selectorRespondContainer, options.beforeSelectElements, options.beforeUpdateComments, options.afterUpdateComments)) return;
			
			if (options.updateUrl) WPAC._UpdateUrl(url);

			// Scroll to anchor
			var waitForScrollToAnchor = false;
			if (options.scrollToAnchor) {
				var anchor = url.indexOf("#") >= 0 ? url.substr(url.indexOf("#")) : null;
				if (anchor) {
					WPAC._Debug("info", "Anchor '%s' extracted from url", anchor);
					if (WPAC._ScrollToAnchor(anchor, options.updateUrl, function() { options.success(); } )) {
						waitForScrollToAnchor = true;
					}
				}
			}
			
			// Unblock UI
			jQuery.unblockUI();
			
			if (!waitForScrollToAnchor) options.success();
		},
		error: function() {
			WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, "WPACFallback", "1"))
		} 
		
	});
	
	return true;
}

jQuery(function() {
	var initSuccesful = WPAC.Init();
	if (WPAC._Options.loadCommentsAsync) {
		if (!initSuccesful) {
			WPAC._LoadFallbackUrl(WPAC._AddQueryParamStringToUrl(window.location.href, "WPACFallback", "1"))
			return;
		}

		var asyncLoadTrigger = WPAC._Options.asyncLoadTrigger;
		WPAC._Debug("info", "Loading comments asynchronously with secondary AJAX request (trigger: '%s')", asyncLoadTrigger);
		
		if (window.location.hash) {
			var regex = /^#comment-[0-9]+$/;
			if (regex.test(window.location.hash)) {
				WPAC._Debug("info", "Comment anchor in URL detected, force loading comments on DomReady (hash: '%s')", window.location.hash);
				asyncLoadTrigger = "DomReady";
			}
		}
		
		if (asyncLoadTrigger == "Viewport") {
			jQuery(WPAC._Options.selectorCommentsContainer).waypoint(function(direction) {
				this.destroy();
				WPAC.RefreshComments();
			}, { offset: "100%" });
		} else if (asyncLoadTrigger == "DomReady") {
			WPAC.RefreshComments({scrollToAnchor: true}); // force scroll to anchor
		}
	} 
});

function wpac_init() {
	WPAC._Debug("info", "wpac_init() is deprecated, please use WPAC.Init()");
	WPAC.Init();
}