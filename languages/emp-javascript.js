/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-javascript.js
*
*	Version 0.1 (November 2015)
*   Copyright (C) 2015  vincent@wiredolphin.net
*
*   This program is free software: you can redistribute it and/or modify
*	it under the terms of the GNU General Public License as published by
*	the Free Software Foundation, either version 3 of the License, or
*	(at your option) any later version.
*
*	This program is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty of
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*	GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public License
*	along with Emphasizer.  If not, see <http://www.gnu.org/licenses/>.
*
*	If you like this software and you find it useful, please make 
*	a donation and encourages the development of Emphasizer
*/
"use strict"

Emphasizer.language.javascript = {
	postProcess: function(tokenized) {		
		var parse = {
			properties: function(tkz, i) { //Properties are detected only if they are located after a '.'
				
				var properties = "constructor prototype MAX_VALUE MIN_VALUE NEGATIVE_INFINITY NaN POSITIVE_INFINITY E LN2 LN10 LOG2E " +
 					"LOG10E PI SQRT1_2 SQRT2 global ignoreCase lastIndex multiline source Infinity NaN accessKey childElementCount " +
 					"attributes childNodes children classList className clientHeight clientLeft clientTop clientWidth contentEditable " +
 					"dir firstChild firstElementChild id innerHTML isContentEditable language lang lastChild lastElementChild namespaceURI nextSibling " +
 					"nodeName nodeType nodeValue offsetHeight offsetWidth offsetLeft offsetParent offsetTop ownerDocument parentNode " +
 					"parentElement previousSibling previousElementSibling scrollHeight scrollLeft scrollTop scrollWidth style tabIndex " +
 					"tagName textContent title length closed defaultStatus frameElement frames history innerHeight innerWidth " +
 					"location name navigator opener outerHeight outerWidth pageXOffset pageYOffset parent readyState screenLeft screenTop" +
 					"screenX screenY scrollX scrollY self status text top type value";

 				var cssProperties = "background backgroundAttachment backgroundColor backgroundImage backgroundPosition backgroundRepeat " +
 									"border borderBottom borderBottomColor borderBottomStyle borderBottomWidth borderColor borderLeft " +
 									"borderLeftColor borderLeftStyle borderLeftWidth borderRight borderRightColor borderRightStyle " +
 									"borderRightWidth borderStyle borderTop borderTopColor borderTopStyle borderTopWidth borderWidth " +
 									"clear clip color cursor display filter font fontFamily fontSize fontVariant fontWeight height left " +
 									"letterSpacing lineHeight listStyle listStyleImage listStylePosition listStyleType margin marginBottom " +
 									"marginLeft marginRight marginTop overflow overflowX overflowY padding paddingBottom paddingLeft paddingRight " +
 									"paddingTop pageBreakAfter pageBreakBefore position cssFloat textAlign textDecoration blink line-through none " +
 									"overline underline textIndent textTransform top verticalAlign visibility width zIndex";
			
 				var highlight = function(tokens, className) {

					var regexp = "^(" + tokens.replace(/\s+/g, '|') + ")$";

	 				if(tkz[i].has('.') && tkz[++i])  {
						if(new RegExp(regexp).exec(tkz[i].value)) {
							tkz[i].type = className;
						}
					}
 				}

 				highlight(properties, 'property');
 				highlight(cssProperties, 'cssProperty');				
			},
			objectConstruction: function(tkz, i) {
				if(tkz[i] && tkz[i].has('new')) {
					if(tkz[i + 2]) {
						if(tkz[i + 2].is('plain')) tkz[i + 2].type = 'object';
					}
				}
			},
			functionNameAndArguments: function(tkz, i) {

				if(tkz[i].has('function')) {
					var j = i;
					while(tkz[++i] && !tkz[i].has('('));
					while(tkz[++i] && !tkz[i].has(')')) {
						if(tkz[i].is('plain')) {
							tkz[i].type = 'argument';
						}
					}
				
					while(tkz[--j] && tkz[j].is('spaces'));
					if(tkz[j] && (tkz[j].has('=') || tkz[j].has(':'))) {
						while(tkz[--j] && tkz[j].is('spaces'));
						if(tkz[j] && tkz[j].is('plain')) {
							tkz[j].type = 'method';

							while(tkz[--j] && !tkz[j].is('spaces')) {
								if(tkz[j].has('.') && !tkz[j - 1].is('property')) {
									tkz[j - 1].type = 'objectHierarchy';
								}
							}
						}
					}
				}
			},
			all: function(tkz) {

				for(var i = 0; i < tkz.length; i++ ) {

					Emphasizer.language.commons.comments(tkz, i, '/*', '*/');
					Emphasizer.language.commons.strings(tkz, i);
					//Emphasizer.language.commons.regexp(tkz, i);
					Emphasizer.language.commons.regexp(tkz, i);
					parse.objectConstruction(tkz, i);
					parse.functionNameAndArguments(tkz, i);
					parse.properties(tkz, i);
				}
			}
		};

		parse.all(tokenized);	
	},
	regex: {
		comment: "\\/\\/.* \\/\\* \\*\\/",
		string: "\" \'",
		escape: "\\\\.",
		keyword: "abstract arguments boolean byte char class const debugger delete double enum eval export extends final " +
				 "finally float function implements import in int interface let long native package private protected " +
				 "public short static synchronized transient var void volatile with yield",
		literal: "null true false undefined",
		keywordSpecial: "this super",
		statement: "break case catch continue default do else for goto if return switch throw throws try while new",
		operator: Emphasizer.language.commons.cstyle.regex.operator,
		parenthesis: '\\{ \\[ \\( \\) \\] \\}',
		digit: "[0-9]+",
		eventHandler: "onclick oncontextmenu ondblclick onmousedown onmouseenter onmouseleave onmousemove onmouseover " +
					   "onmouseout onmouseup onkeydown onkeypress onkeyup onabort onbeforeunload onerror onhashchange onload " +
					   "onpageshow onpagehide onresize onscroll onunload onblur onchange onfocus onfocusin onfocusout oninput " +
					   "oninvalid onreset onsearch onselect onsubmit ondrag ondragend ondragenter ondragleave ondragover " +
					   "ondragstart ondrop oncopy oncut onpaste onafterprint onbeforeprint onabort oncanplay oncanplaythrough " +
					   "ondurationchange onemptied onended onerror onloadeddata onloadedmetadata onloadstart onpause onplay " +
					   "onplaying onprogress onratechange onseeked onseeking onstalled onsuspend ontimeupdate onvolumechange " +
					   "onwaiting animationend animationiteration animationstart transitionend onerror onmessage onopen onmessage " +
					   "onmousewheel ononline onoffline onpopstate onshow onstorage ontoggle onwheel ontouchcancel ontouchend " +
					   "ontouchmove ontouchstart",
 		globalObject: "Array Date function Infinity Math NaN Number Object String undefined Object Function Boolean Symbol Error " +
 					   "EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError RegExp",
 		globalFunction: "eval hasOwnProperty isFinite isNaN isPrototypeOf toString valueOf",
 		BOM: "window navigator screen history location",
 		DOM: "document body",
 		specialOperator: "instanceof typeof",
 		regexp: "\\/[^\\/]*\\/g?i?m?y?",
 		specialTag: "<\/?script>?"
 	},
	splitTokens: ["specialTag", "comment", "string", "escape", "regexp", "BOM", "DOM", "literal", "eventHandler", "specialOperator", "operator", "parenthesis"],
	inlineCodeTags: { open: '<script[^>]*>', close: '<\\/script>', tagLanguage: 'xhtml' }
}

