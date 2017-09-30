/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-core.js
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

/**********************************************************************************************
*   Main function. Creating an instance of Emphasizer 
*	allows to use the object reference and take advantage
*	of its methods.
*	Arguments:
*		selector    type:string    the selector string of the element that contains
*								   the source code. A class can be used to reference
*								   multiple elements. NOTE: If the code is not loaded from
*								   an external file, a <pre> element should be used;
*		language    type:string    a string containing the required languages comma separated;
*		[options]   type:object    optional, will be merged or will overwrite the default one.						   
***********************************************************************************************/
var Emphasizer = function(selector, languages, options) {

	/* Default options */
	var defaults = {
		theme: 'default', 														//'rainbow-theme', 'dark-theme'

		lineNumbers: false, 													//create left side line number

		startLineNumber: 1,														//sets the initial line number count

		anchoredLineNumbers: false, 											//true to lock line number on horizontal scroll

		toolbar: { select : true, plain : true, print: true, toggle: true }, 	//activate/deactivate toolbar buttons

		highlightLines: null, 													//sets highlighted line (array of integers)

		alternateLinesBackground: false, 										//lines background color (bool/string with comma
																				//separated values, e.g.: 'white,black' or 'white, #0a0a0a')
																				//if false, the theme dependent value is used

		fileName: '',															//file name shown by toolbar (string)

		filePath: '',															//if set, the file will be loaded asynchronously and
																				//highlithed inside the 'selector' element

		leftMargin: 4,															//distance between code and left margin

		breakLines: false,														//if true, break lines and hides horizontal scroll bar

		lineHeight: null,														//custom line height, null to use the theme dependent value

		fontSize: null															//custom font size, null to use the theme dependent value
	};

	this.opt = defaults;
	this.ready = 0;
	this.themes = [ 'default', 'midnight'];
	if(!Emphasizer.language) Emphasizer.language = new Object();
	
	/*
	*	Constructor: merges options with the default
	*	and initialice each node referenced by the
	*	selector argument.
	*/
	this.Emphasizer = function(){

		if(options && typeof options === "object") {
			this.opt = extendDefaults(defaults, options);
	    }

	    this.languages = languages.replace(/\s/g, '').split(',');
	    this.initNodes(selector);
		autoload(this);
		return this;
	};

	this.initNodes = function(selectorString) {
		this.nodes = document.querySelectorAll(selectorString);
		$(this.nodes).forEach(function(n) { $(n).hide(); });
	};

	/* 
	*	Options merge function.
	*/
	function extendDefaults(defaults, properties) {
		var property;
		for(property in properties) {
			if(defaults.hasOwnProperty(property)) {
				defaults[property] = properties[property];
			}
		}
		return defaults;
	};

	/* 
	*	Creates a CodeEmphasizer instance for each
	*	node (determined by the selector argument)
	*	and associate such instance to the given 
	*	Emphasizer object.
	*	Uses the Xhr object if 'filePath' option
	*	is provided. This loads the code from the file
	*	referenced by the path string.
	*	Argument:
	*		emp    type:object    the emphasizer instance
	*/	
	function highlightAll(emp) {

		var highlight = function(node) {

			if(!emp.opt.filePath.isEmpty() && /^\s*$/.test(node.innerHTML)) {

				var cb = function(fileContent) {
					new CodeEmphasizer(node, emp, fileContent);
				}
				new Xhr(emp.opt.filePath, cb); //code is loaded from file

			} else {

				new CodeEmphasizer(node, emp);
			}		
		}

		for(var i = 0; i < emp.nodes.length; i++) {
			highlight(emp.nodes[i]);
		}
	};

	/*
	*	Loads required programming language and theme files 
	*	creating the referencing elements and including them into
	*	the <head> section. Emphasizer will perform
	*	its actions only when all required scripts
	*	are completely loaded. This happens asynchronously.
	*/
	function autoload(emp) {
		if(!Emphasizer.filePath) {
			Emphasizer.filePath = utils.getScriptPath();
		}

		utils.addStylesheet(Emphasizer.filePath + 'emp-styles.css');
		emp.setTheme(emp.opt.theme);
		utils.loadScripts(Emphasizer.filePath, emp, highlightAll);
	}

	/*
	*	Asynchronous file load utility functions.
	*/
	var utils = {
		head:  document.getElementsByTagName("head")[0],
		getScriptPath: function() {

			var s = document.querySelector('script[src$="emp-core.js"]');
			
			if(null == s) {
				throw new Error('Cannot find script url');
			}

			return s.src.replace('emp-core.js', '');
		},
		addStylesheet: function(url, media, callback) {

			var s = document.querySelector('link[href="' + url + '"]');
			if(!s) {
				s = $('link', { rel: 'stylesheet', type: 'text/css', href: url, media: media ? media : 'all' });        	
	        	if(callback) {
	        		$(s).on('load', callback);
	        	}
	        	$(utils.head).append(s);
	        } else {
	        	if(callback) { callback() };
	        }
		},
		loadScripts: function(path, emp, callback) {

			var areLoaded = function(state) {					
				for(var i = 0; i < emp.languages.length; i++) {
					if(undefined === Emphasizer.language[emp.languages[i]]) {
						return false;
					}
				}
				return true;
			};

			var loadHandler = function(event) {
				var evt = event || window.event;
	        	var s = evt.target || evt.srcElement;

	        	if(s && s.readyState) {
		        	if(s.readyState === 'loaded' || s.readyState === 'complete') {
		                if(areLoaded()) {
		                	areLoaded = function() { return false; } //ensures one time call on IE9
				        	callback(emp);
				        }
		        	}
		        } else {
	                if(areLoaded()) {
			        	callback(emp)
			        }
		        }
			}

			for(var i = 0; i < emp.languages.length; i++) {

				var url = path + 'languages/emp-' + emp.languages[i] + '.js';
				var s = document.querySelector('script[src="' + url + '"]');

				if(!s) { //script must be added			
					s = $('script', { type: 'text/javascript', src: url });
		    		$(utils.head).append(s);
				}

				$(s).on('load readystatechange', loadHandler);			
			}
		}
	}

	/*
	*	Each token identifyed inside the
	*	source listing will be kept by this
	*	object which maps the token itself
	*	(value) to its type.
	*/ 
	var Token = function(type, value) {
		this.type = type;
		this.value = value;
		this.is = function(type) {
			return this.type == type;
		}
		this.has = function(value) {
			return this.value == value;
		}
		return this;
	}

	/***********************************************************
	*	This is to be considered a 'language file' as the
	*	external dedicated programming language files,
	*	although it contains token-identifier-functions common
	*	to different programming languages.	
	************************************************************/
	Emphasizer.language.commons = {
		/* searches for multi-lines comment */
		comments: function(tkz, i, open, close) {

			var append = function(tkz, i) {
				var c = i++;
				while(tkz[i]) {
					if(tkz[i].has('\n') || (tkz[i - 1] && tkz[i - 1].has('\n'))) {
						c = i++;
						continue;
					}
					var t = tkz.splice(i, 1)
					tkz[c].value += t[0].value;
					tkz[c].type = 'comment';
					
					if(t[0].has(close)) {
						break;
					}
				}			
			}

			if(tkz[i].has(open)) {
				append(tkz, i);
			}
		},
		/* searches for strings */
		strings: function(tkz, i) {

			var append = function(tkz, i, quote) {

				var c = i++;

				while(tkz[i]) {

					if(tkz[i].has('\n') || (tkz[i - 1] && tkz[i - 1].has('\n'))) {
						c = i++;
					} 
					else if(tkz[i].is('escape')) {
						tkz[i].type = 'escapeChar';
						c = i++;
					} 
					else if(tkz[i - 1] && tkz[i - 1].is('escapeChar')) {

						if(tkz[i].has(quote)) {
							break;
						}
						c = i++;
						tkz[c].type = 'string';
					} 
					else {
						var t = tkz.splice(i, 1)
						tkz[c].value += t[0].value;
						tkz[c].type = 'string';
						
						if(t[0].has(quote)) {
							break;
						}				
					}				
				}			
			}
	
			if(/^("|')$/.test(tkz[i].value)) {
				if(tkz[i - 1] && (tkz[i - 1].is('string') || tkz[i - 1].is('escapeChar'))) {
					return;
				}
				append(tkz, i, tkz[i].value);
			}
		},
		/* searches for javascript type regular expressions */
		regexp: function(tkz, i) {
			if(tkz[i].is('regexp')) {
				tkz[i].value.replace(/\\./, function(m, offset, token) {
					tkz[i].value = token.substring(0, offset);
					tkz.splice(i + 1, 0, new Token('escapeChar', m));
					tkz.splice(i + 2, 0, new Token('regexp', token.substring(offset + 2)));	
				});
			}
		},
		cstyle: {
			strings: function(tkz, i) {
				Emphasizer.language.commons.strings(tkz, i);
			},
			regex: {
				operator: "\\+\\= \\*\\= \\-\\= \\/\\= \\%\\= \\>\\= \\<\\= \\={1,2} \\+{1,2} \\* \\/ " +
				  		  "\\<{1,2} \\>{1,2} \\-{1,2} \\. \\&{1,2} \\% \\? \\: \\|{1,2} \\^ \\!"
			}
		},
		xhtml: {
			escape: function(c) {
				return c.replace(/\&gt;/, '>').replace(/\&lt;/, '<');
			}
		}
	}

	/*************************************************************
	*	The core function: for each node referenced by the
	*	selector string, it performs the multiple-language-block
	*	parsing (if any) the main language parsing and finally
	*	builds the html for the syntax highlighted code,
	*	toolbar, modal dialogs, scrollbars.
	*	Multiple programming language are allowed in a single 
	*	source code listing making use of the pattern:
	*
	*	<inline:programming-language>
	*		code
	*	</inline:programming-language>
	*
	*	or using html tags (<script>, <style>, <php>)
	**************************************************************/
	var CodeEmphasizer = function(node, emp, rawCode) {

		var languages = emp.languages;
		var opt = emp.opt;
		this.n = node;

		/*
		*	A code block will be created for each type 
		*	of programming language nested inside the
		*	source listing.
		*/
		var CodeBlock = function(language, code) {
			this.language = language;
			this.code = code;
		}		

		/*
		*	Uses regexp for parsing the 'raw'
		*	source code.
		*/
		var Parser = function(node, code, o) {
			this.rawCode = code ? code : node.innerHTML;
			this.codeBlocks = null;

			var match = function(lang, word) {

				var languageTokens = Emphasizer.language[lang].regex;

				for(var type in languageTokens) {
					if(languageTokens.hasOwnProperty(type)) {

						if(new RegExp(getRegExp(languageTokens[type])).exec(word)) {
							return type;
						}
					}
				}
				return 'plain';
			};
			var getSplitRegExp = function(lang) {
				var language = Emphasizer.language[lang];
				var languageTokens = language.regex;
				
				var regex = "(\\s ; ,";
				for(var i = 0; i < language.splitTokens.length; i++) {

					var type = language.splitTokens[i];

					if(languageTokens[type]) {				
						regex += ' ' + languageTokens[type];
					}
				}
				regex += ")";

				return new RegExp(regex.replace(/\s+/g, "|"), 'g');
			};
			var getRegExp = function(string) {
				return "^(" + string.replace(/\s+/g, "|") + ")$";
			};
			/*
			*	Splits the code by the nested programming
			*	language, in any.
			*/
			var readBlocks = function(rawCode) {

				var getBlocksParsingRegExp = function() {

					var re = "(<inline:";
					for(var i = 0; i < languages.length; i++) {

	                	var l = Emphasizer.language[languages[i]];                	
	                	if(!l) {
	                		throw new Error('Script for language: ' + languages[i] + ' not loaded!')
	                	}

	                    if(l.inlineCodeTags) {
	                    	re += "|" + l.inlineCodeTags.open;
	                    }                   
	                }
					return re + ")";
				}

				var getInlineCodeTags = function(tag) {
					for(var i = 0; i < languages.length; i++) {
						var lng = Emphasizer.language[languages[i]];

						if(lng.inlineCodeTags) {
	                        if((new RegExp(lng.inlineCodeTags.open, 'i')).test(tag)) {
	                        	return { 'language' : languages[i], 'tags' : lng.inlineCodeTags } ;
	                        }
	                    }
					}
					return null;
				}

				var isValidStartInlineBlockTag = function(rawCode, mOffset, cOffset) {
					var gt = 0, lt = 0;
					while(cOffset++ < (mOffset - 1)) {
						if(rawCode.charAt(cOffset) == '<') lt = cOffset;
						if(rawCode.charAt(cOffset) == '>') gt = cOffset;
					}
					return gt >= lt;
				}

				/*
				*	Makes use of the replace method and regexp to locate 
				*	the inline block closing tag, even if it become
				*	magically uppercase (ie <= 8). If found, returns an object
				*	containing the closeing tag and its offset, -1 otherwise.
				*/
				String.prototype.getNextCloseTag = function(regex, offset) {
					var i = -1, s = this.substring(offset);
					s.replace(new RegExp(regex, "i"), function(m, mOffset) {
						i = { tag : m, index : offset + mOffset }
					});
					return i;
				}

				var getBlocks = function(rawCode) {
					
					var codeBlocks = [];
					var mainLanguage = emp.languages[0].toLowerCase();
					var mainLanguageBlock = '', inlineLanguageBlock = '', language = '';
					var cOffset = 0; //current offset inside 'raw' code

					var re = new RegExp(getBlocksParsingRegExp(), 'gi');

					rawCode.replace(re, function(m, p1, mOffset, str) {

						/* Ensures that the tag is not inside html tag or string */
						if(!isValidStartInlineBlockTag(rawCode, mOffset, cOffset)) return;

						if(mOffset < cOffset) {
							return; //match already processed
						}

						var ict = getInlineCodeTags(m);

						if(ict && (ict.tags.tagLanguage == mainLanguage)) {
							mOffset += m.length;
						}

						if(mOffset >= cOffset) {
							mainLanguageBlock = rawCode.substring(cOffset, mOffset);
							codeBlocks.push(new CodeBlock(mainLanguage, mainLanguageBlock));
						}

						/* inline pattern is used */
						if(/<inline:/i.test(m)) {
						
							var bStart = rawCode.indexOf('>', mOffset + m.length);
							var nextCloseTag = rawCode.getNextCloseTag('<\/inline:', bStart);
							var bEnd = nextCloseTag.index;
							language = rawCode.substring(mOffset + m.length, bStart).toLowerCase();
							cOffset = bEnd + '</inline:'.length + language.length + 1;

							inlineLanguageBlock = rawCode.substring(bStart + 1, bEnd);
							
						} else { /* language dependent tag (e.g.: <script>) */

							var closeTag = rawCode.getNextCloseTag(ict.tags.close, mOffset);
							language = ict.language;

							if(language == ict.tags.tagLanguage) {
								cOffset = closeTag.index + closeTag.tag.length;
							} else {
								cOffset = closeTag.index;
							}

							inlineLanguageBlock = rawCode.substring(mOffset, cOffset);						
						}

						codeBlocks.push(new CodeBlock(language, inlineLanguageBlock));	
					});
				
					if(cOffset < rawCode.length) {
						mainLanguageBlock = rawCode.substring(cOffset, rawCode.length);
						codeBlocks.push(new CodeBlock(mainLanguage, mainLanguageBlock));
					}

					return codeBlocks;
				}
			
				return getBlocks(rawCode);
			};
			/*
			*	Locate tokens and creates for each a Token object.
			*/
			var getParsedBlock = function(codeBlock) {

				var content, l = codeBlock.language;
				var content = codeBlock.code;

				if(Emphasizer.language[l].escape) {
					content = Emphasizer.language[l].escape(codeBlock.code);
				}

				var tokenized = new Array();

				if(!(Emphasizer.language[l])) {
					tokenized.pushToken('', content);
					return tokenized;
				}

				var preTokenized = content.splitAndKeep(getSplitRegExp(l));

				for(var i = 0; i < preTokenized.length; i++) {
								
					if(/^\n$/.test(preTokenized[i])) {

						tokenized.pushToken('', preTokenized[i]);

					} else if(preTokenized[i].isWhiteSpace()) {

						var spaces = ' ';
						while(preTokenized[++i] && preTokenized[i].isWhiteSpace()) {
							spaces += ' ';
						}
						--i;
						tokenized.pushToken('spaces', spaces);

					} else if(preTokenized[i].length) {
						var tokenType = match(l, preTokenized[i]);
						tokenized.pushToken(tokenType, preTokenized[i]);
					}									
				}

				tokenized.refine(Emphasizer.language[l].postProcess);
				return tokenized;
			};
			this.getFilteredRawCode = function() {
				return this.rawCode.replace(/<\/?inline:(.*)>/gi, '');
			};
			this.getCodeBlocks = function() {
				if(!this.codeBlocks) {
					this.codeBlocks = this.getParsed();
				}
				return this.codeBlocks;
			},
			/*
			*	Returns an array of 'code blocks', containing
			*	only one element if one programming language
			*	is used inside a single listing.
			*/
			this.getParsed = function() {
				var codeBlocks = readBlocks(this.rawCode);
				
				for(var i = 0; i < codeBlocks.length; i++) {
					codeBlocks[i].code = getParsedBlock(codeBlocks[i]);					
				}
				return codeBlocks;
			}
		};

		/*
		*	Builds the final result: toolbar, highlighted code
		*	container and content, scrollbars if required,
		*	modal dialogs, printable highlighted source.
		*/
		var html = {
			isEven: function(number) { 
				return (number % 2) == 0;
			},
			setLineStyle: function(li, index, o) {
				if(o.alternateLinesBackground) {
					if(typeof o.alternateLinesBackground == 'string') {
						var colors = o.alternateLinesBackground.replace(/\s+/g, '').split(',');
						li.style.backgroundColor = html.isEven(index) ? colors[0] : (colors[1] ? colors[1] : colors[0]);
					} else {
						$(li).addClass('emp-' + (html.isEven(index) ? 'odd' : 'even'));
					}				
				}				
			},
			setLineHeight: function(li, o) {
				if(o.lineHeight) {
					li.style.lineHeight = o.lineHeight + 'px';
					li.style.minHeight = o.lineHeight + 'px';
				}
			},
			isNewLine: function(token) {
				return token && /^\n$/.test(token.value);
			},
			/*
			*	Creates a line element for each source code line
			*	and returns an array.
			*/
			get: {
				lines: function(blocks) {
					var lines = [], code;				
					var cl = $('div', { className: 'emp-code-line' });

					var parse = function(block, i) {												
						var tkz = block.code;
						code = $('code', { className: ['emp-' + block.language, 'emp-code-block'].join(' ') } );

						if(!html.isNewLine(tkz[0])) {
							$(cl).append(code);
						}

						for(var j = 0; j < tkz.length; j++) {

							if(html.isNewLine(tkz[j])) {

								lines.push(cl);
								cl = $('div', { className: 'emp-code-line' });
								code = $('code', { className: ['emp-' + block.language, 'emp-code-block'].join(' ') } );

								if(!html.isNewLine(tkz[j + 1])) {
									$(cl).append(code);
								}

							} else {
								var token = $('span', { className: tkz[j].type, textContent: tkz[j].value });
								$(code).append(token);
							}
						}
					}

					$(blocks).forEach(parse);
					lines.push(cl);
					return lines;
				}
			},
			setLeftMargin: function(line, o) {
				var i = o.leftMargin, s = '';
				while(i--) s += ' ';
				var leftMargin = $('code', { className: 'emp-left-margin' });
				$(leftMargin).append($('span', { innerText: s }));
				$(line).prepend(leftMargin);
			},
			/*
			*	Creates highlighted code html, background, line number
			*	container (ruler), scrollbars.
			*/
			create: {
				linesList: function(blocks, o) {
					var lines = html.get.lines(blocks), ol = $('ol');

					$(lines).forEach(function(line, i) {
						var li = $('li');
						html.setLineHeight(li, o);

						if(o.breakLines) {
							html.setLineStyle(li, i + 1, o);
						}

						if(o.printable) {
							$(li).append($('div', {className: 'emp-ruler-line', innerText: i + 1 }));
						}

						if(o.leftMargin) html.setLeftMargin(line, o);
						$(li).append(line);				
						$(ol).append(li);
					});

					return ol;
				},
				codeWrapper: function(lines, o) {
					var code = $('div', { className: 'emp-code-wrapper'} );
					var pre = $('pre');
					$(pre).append(lines);
					$(code).append(pre);
					return code;
				},
				backgroundContainer: function(lines, o) {
					var ol = $('ol'), back;
					back = $('div', { className: 'emp-background'});
					for(var i = 0; i < lines.childNodes.length; i++) {
						var li = $('li');						
						html.setLineStyle(li, i + 1, o);
						html.setLineHeight(li, o);
						$(ol).append(li);
					}
					$(back).append(ol);
					return back;					
				},
				ruler: function(lines, o) {
					var ruler = $('div', { className: 'emp-ruler emp-unselectable' });
					var s = o.startLineNumber ? o.startLineNumber : 1;

					if(o.breakLines) {					
						$(lines.childNodes).forEach(function(elm, i) {
							var lineHeight = o.lineHeight ? o.lineHeight : 25;
							var h = Math.round(elm.clientHeight / lineHeight) * lineHeight;
							var ln = $('div', {
								className: 'emp-ruler-line', 
								textContent: i + s, style: { height: h + 'px'} 
							});
							html.setLineStyle(ln, i + s, o);
							elm.style.height = h + 'px';
							$(ruler).append(ln);
						});
					} else {
						$(lines.childNodes).forEach(function(elm, i) {
							var ln = $('div', { className: 'emp-ruler-line',  textContent: i + s });
							html.setLineStyle(ln, i + s, o);
							$(ruler).append(ln)
						});
					}
					return ruler;
				},
				scrollbar: function(scrollElm, container, alignment) {
					var dim = alignment == 'horizontal' ? 'Width' : 'Height';
					if(scrollElm['scroll' + dim] > scrollElm['client' + dim]) {
						var sb = new Scrollbar(scrollElm, alignment == 'horizontal');
						sb.appendTo(container, 'emp-scrollbar-' + alignment);
					}
				}
			},
			addRuler: function(main, element, lines, o) {
				var r;
				if(o.lineNumbers || o.anchoredLineNumbers) {
					$(main).addClass('emp-ruler-on');
					r = html.create.ruler(lines, o);
					$(element).append(r);
				}
				return r;
			},
			resetRightMargin: function(mainContainer, scrollWrapper) {
				var m = (scrollWrapper.clientWidth - mainContainer.clientWidth) + 1;
				if(m < 0) scrollWrapper.style.marginRight = m + 'px';
			},
			/*
			*	Builds the whole html assembling each container.
			*/
			assemble: function(wrapper, main, back, core, code) {
				$(core).append(code);
				$(back).append(core);
				$(main).append(back);
				$(wrapper).append(main);
			}
		}
		
		/*
		*	Creates the CodeEmphasizer object itselfs.
		*/
	 	this.init = function() {

	 		var parser = new Parser(this.n, rawCode, opt);
	 		this.n.innerHTML = '';
	 		$(this.n).show();

	 		emp.wrapper = $('div', { className: 'emp-wrapper' });
	 		$(emp.wrapper).addClass('emp-' + opt.theme)
	 		$(this.n).append(emp.wrapper);

	 		var main = $('div', { className: 'emp-main-container' } ),
			core = $('div', { className: 'emp-core-container' } );
			
			var lines = html.create.linesList(parser.getCodeBlocks(), opt);
			emp.codeElm = html.create.codeWrapper(lines, opt);

			if(opt.fontSize) {
	 			emp.wrapper.style.fontSize = opt.fontSize;
	 		}
			if(opt.alternateLinesBackground) {
				$(main).addClass('emp-alt');
			}
			if(opt.breakLines) {

				$(main).addClass('emp-layout-break-lines');
				emp.back = $('div', { className: 'emp-background' });
				html.assemble(emp.wrapper, main, emp.back, core, emp.codeElm);
				emp.ruler = html.addRuler(main, core, lines, opt);
				html.create.scrollbar(emp.back, emp.wrapper, 'vertical');

			} else if(opt.anchoredLineNumbers) {

				$(main).addClass('emp-layout-anchored')
				emp.back = html.create.backgroundContainer(lines, opt);
				html.assemble(emp.wrapper, main, emp.back, core, emp.codeElm);
				emp.ruler = html.addRuler(main, core, lines, opt);
				html.create.scrollbar(emp.codeElm, emp.wrapper, 'horizontal');
				html.create.scrollbar(emp.back, emp.wrapper, 'vertical');

			} else {

				$(main).addClass('emp-layout-default');
				emp.back = html.create.backgroundContainer(lines, opt);
				html.assemble(emp.wrapper, main, emp.back, core, emp.codeElm);
				emp.ruler = html.addRuler(main, emp.codeElm, lines, opt);
				html.create.scrollbar(emp.codeElm, emp.wrapper, 'horizontal');
				html.create.scrollbar(emp.back, emp.wrapper, 'vertical');
			}

			html.resetRightMargin(main, core); //required by all browsers on Windows platform

	 		if(opt.toolbar) {
	 			emp.toolbar = toolbar.create(main, emp.codeElm, parser, opt);
	 			$(emp.wrapper).prepend(emp.toolbar);
	 		}
	 		
	 		if($.isArray(opt.highlightLines)) {
				highlightLines(emp);
			}
			actions.onDoubleClick(emp.codeElm.firstChild);

			return emp.wrapper;
		}

		/*
		*	The toolbar at the top of the highlighted code
		*	container. Can be hidden setting the corresponding
		*	option. Provides following functionality:
		*	
		*	a. plain code modal dialog;
		*	b. code selection;
		*	c. open print highlighted code dialog;
		*	d. open about modal dialog;
		*/
		var	toolbar = {
			create: function(main, codeWrapper, parser, opt) {

				var tb = $('div', { className: 'emp-tb-wrapper' });
				var fileName = $('div', { className: 'emp-tb-filename', innerHTML: opt.fileName });
				var buttons = $('div', { className: 'emp-tb-buttons'});

				var action = {		
					openAbout: function() {					
						var dlg = new Dialog(340, 150);
						dlg.setContent([
							$('div', { className: 'emp-modal-msg', innerHTML: 'Emphasizer v0.1' }),
							$('div', {
								className: 'emp-modal-auth', 
								innerHTML: '<span>a project by</span> vincent@wiredolphin.net <span>&copy; 2015</span>' 
							})
						]);
						dlg.open();
					},
					openPlain: function() {
						var dlg = new Dialog(800, 550);
						$(dlg.getElement()).addClass('emp-plain-text-dialog');

						var container = $('div', { className: 'emp-plain-container' });
						var code = $('textarea', { className: 'emp-plain-code', value: parser.getFilteredRawCode() });
						$(container).append(code);
						dlg.setContent([container]);
						dlg.open();
						html.create.scrollbar(code, container, 'vertical');
					},
					selection: function() {
						actions.selection(codeWrapper.firstChild);
					},
					print: function() {
						
						var po = opt;
						po.breakLines = po.lineNumbers = po.printable = true;			
						var lines = html.create.linesList(parser.getCodeBlocks(), po);
						var codeWrapper = html.create.codeWrapper(lines, po);

						var print = $('div', { className: 'emp-print-wrapper' });
						$(print).addClass('emp-' + po.theme);
						$(print).append(codeWrapper);

						var printCode = function() {
							$(document.body).append(print);
							window.print();
							$(document.body).remove(print);
						}

						utils.addStylesheet(Emphasizer.filePath + 'emp-print.css', 'print', printCode);					
					},
					toggle: function() {
						!$(main).hasClass('emp-toggle-plain') ? 
							 $(main).addClass('emp-toggle-plain') : 
								$(main).removeClass('emp-toggle-plain');						
					}
				}

				var buttonRequired = function(button) {
					return opt.toolbar[button] == true || opt.toolbar[button] == undefined;
				}
		
				$(buttons).append($('input', { type: 'button', value: '?', onclick: action.openAbout }));
				if(buttonRequired('print'))
					$(buttons).append($('input', { type: 'button', value: 'print', onclick: action.print }));
				if(buttonRequired('plain'))	
					$(buttons).append($('input', { type: 'button', value: 'plain', onclick: action.openPlain }));
				if(buttonRequired('select'))
					$(buttons).append($('input', { type: 'button', value: 'select', onclick: action.selection }));
				if(buttonRequired('toggle'))
					$(buttons).append($('input', { type: 'button', value: 'toggle', onclick: action.toggle }));
			
				$(tb).append(fileName);
				$(tb).append(buttons);

				return tb;
			}
		};

		var actions = {
			selection: function(element) {

			    if(document.selection) {
			        var range = document.body.createTextRange();
			        range.moveToElementText(element);
			        range.select();
			    } else if(window.getSelection()) {
			        var range = document.createRange();
			        range.selectNode(element);
			        window.getSelection().removeAllRanges();
			        window.getSelection().addRange(range);
			    }
			},
			onDoubleClick: function(element) {
				element.ondblclick = function() {
					actions.selection(element);
				}
			}	
		};
	
		emp.ready += 1;
		if(emp.isReady() && emp.callback) {
			emp.callback();
		}
		return this.init();		
	};

	/*******************************************************
	*	Creates unique custom scrollbars, which are 
	*	identical, customizable and not browser dependent.
	********************************************************/
	var Scrollbar = function(scrollElm, horizontal) {
		var scrollbar, thumb, clientSize, scrollSize, shift, scrollDirection;

		this.init = function() {
			scrollbar = $('div', { className: 'emp-scrollbar' });
 			thumb = $('div', { className: 'emp-scrollbar-thumb' });
 			$(scrollbar).append(thumb);

 			clientSize = horizontal ? 'clientWidth' : 'clientHeight';
			scrollSize = horizontal ? 'scrollWidth' : 'scrollHeight';
			scrollDirection = horizontal ? 'scrollLeft' : 'scrollTop';
			shift = horizontal ? 'marginLeft' : 'marginTop';

 			$(scrollElm).on('scroll', scrollHandler);
 			$(thumb).on('mousedown', thumbShift);
			return this;
		}

		var scrollHandler = function(evt) {
		    var target = evt.currentTarget || evt.srcElement;
			var delta = (target[scrollDirection] / scrollElm[scrollSize]) * scrollbar[clientSize];			
 			thumb.style[shift] = delta + 'px';
		}

		var disableSelection = function(disable) {
			document.onselectstart = document.onmousedown = disable ? function() { return false; } : null;
		}

		var thumbShift = function(evt) {
			$(scrollbar).addClass('emp-scrollbar-active');
			var start = evt[horizontal ? 'clientX' : 'clientY'];
			var orig = thumb[horizontal ? 'offsetLeft' : 'offsetTop'];
		    var delta = start - orig;

		    $(document).on("mousemove", moveHandler);
		    $(document).on("mouseup", upHandler);
		    disableSelection(true);

		    if(evt.stopPropagation) evt.stopPropagation();		    
		    if(evt.preventDefault) evt.preventDefault(); //Prevent any default action.

		    function moveHandler(e) {
		        if(!e) e = window.evt; //IE Event Model
		        
		        var pos = e[horizontal ? 'clientX' : 'clientY'] - delta;

		        if(pos <= 0) { //corrects lower and upper bounds
		        	pos = 0;
		        } else if(pos + thumb[clientSize] + 2 > scrollbar[clientSize]) {
		        	pos = scrollbar[clientSize] - thumb[clientSize] - 2;
		        }

		        thumb.style[shift] = pos + "px";
		        var scroll = (pos * (scrollElm[scrollSize] / scrollbar[clientSize]));
		        scrollElm[scrollDirection] = scroll;
		        if(e.stopPropagation) e.stopPropagation();
		    }

		    function upHandler(e) {
		    	$(scrollbar).removeClass('emp-scrollbar-active');
		        if(!e) e = window.evt;  //IE Event Model

		        $(document).off("mousemove", moveHandler);
		    	$(document).off("mouseup", upHandler);
		        if(e.stopPropagation) e.stopPropagation();
		        disableSelection(false);
		    }
		}

		Scrollbar.prototype.setThumbSize = function(s) {
			thumb.style[horizontal ? 'width' : 'height'] = s + 'px';
		}
		Scrollbar.prototype.getElement = function(className) { 
			if(className) $(scrollbar).addClass(className); return scrollbar;
		}

		Scrollbar.prototype.appendTo = function(element, className) {
			$(element).append(this.getElement(className));
		 	var s = (scrollElm[clientSize] / (scrollElm[scrollSize] / scrollElm[clientSize]));
			this.setThumbSize(s - 4);
		}
		return this.init();
	};

	/***************************************************
	*	Creates modal dialogs.
	*	The modal behavior is obtained through a 
	*	overlay with a cool blur effect, if supported
	*	by the browser.
	****************************************************/
	var	Dialog = function(w, h) {
		var dlg, overlay, closeButton, container, content, toolbar;
		this.init = function() {

			overlay = $('div', { className: 'emp-modal-overlay' });

			dlg = $('div', { 
				className: 'emp-modal', 
				style: { 
					width: w + 'px', 
					height: h + 'px',
					left: Math.round((document.body.clientWidth / 2) - (w / 2)) + 'px' 
				} 
			});
			toolbar = $('div', { className: 'emp-modal-bar' });
			container = $('div', { className: 'emp-modal-container' });
			content = $('div', { className: 'emp-modal-content'});
			closeButton = $('button', { innerHTML: 'close' });

			$(dlg).append(toolbar);
			$(dlg).append(container);
			$(container).append(content);				
			$(container).append(closeButton);
			$(overlay).append(dlg);
			$(toolbar).on('mousedown', drag)

			return this;
		}

		this.setContent = function(elements) {
			for(var i = 0; i < elements.length; i++) {
				$(content).append(elements[i]);
			}
		}
		var drag = function(event) {
			if(!event) event = window.event;
			var startX = event.clientX, startY = event.clientY;
			var origX = dlg.offsetLeft, origY = dlg.offsetTop;
		    var deltaX = startX - origX, deltaY = startY - origY;

		    $(document).on("mousemove", moveHandler);
		    $(document).on("mouseup", upHandler);
		    if(event.stopPropagation) event.stopPropagation();
		    if(event.preventDefault) event.preventDefault();

		    function moveHandler(e) {
		        if(!e) e = window.event;
		        dlg.style.left = (e.clientX - deltaX) + "px";
		        dlg.style.top = (e.clientY - deltaY) + "px";
		        if(e.stopPropagation) e.stopPropagation();
		    }

		    function upHandler(e) {			        
		        $(document).off("mouseup", upHandler);
		    	$(document).off("mousemove", moveHandler);
		    	if(!e) e = window.event;
		        if(e.stopPropagation) e.stopPropagation();
		    }
		}

		var blockPage = function(blocked) {

			document.documentElement.style.overflow = blocked ? 'hidden' : 'auto';

			var isValidNode = function(n) {
				return (n.nodeType == 1) && (undefined != n.nodeName) && 
					   (n.nodeName !== 'SCRIPT') && (n.nodeName !== 'STYLE')
			}

			if(blocked) {
				if($($('div', { className: 'emp-blur-element'})).cssSupported('filter')) {
					for(var i = 0; i < document.body.childNodes.length; i++) {
						var c = document.body.childNodes[i];					
						if(isValidNode(c) && !$(c).hasClass('emp-modal-overlay')) {
							$(c).addClass('emp-blur-element').addClass('emp-unselectable');
						}
					}
				} else {
					$(overlay).addClass('emp-darken-overlay');
				}
			} else {
				for(var i = 0; i < document.body.childNodes.length; i++) {
					var c = document.body.childNodes[i];					
					if(isValidNode(c)) {
						$(c).removeClass('emp-unselectable').removeClass('emp-blur-element');
					}
				}
			}
		}

		this.open = function() {					
			$(document.body).append(overlay);
			blockPage(true);
			closeButton.onclick = function() {
				blockPage(false);
				$(document.body).remove(overlay);
			};
		};

		Dialog.prototype.getElement = function() { return dlg; };

		return this.init();
	};

	/*****************************************************
	*	A little integrated javascript framework
	*	(jsmart, copyright 2015 vincent@wiredolphin.net)
	*	that helps to write less code avoiding
	*	the use of more complex and well known 
	*	frameworks.
	******************************************************/
	(function(w) {
        "use strict"
        w.jsmart = w.$ = function() {     
            var Element = function(element) {
                if(element) {
                    this.elm = element;
                }
                this.create = function(arg) {
                    this.elm = document.createElement(arg[0]);
                    var properties = arg[1];
                    if(properties && typeof properties === 'object') {
                        for(var prop in properties) {
                            if(properties.hasOwnProperty(prop)) {
                                if(typeof properties[prop] == 'object') {
                                    for(var p in properties[prop]) {
                                        if(properties[prop].hasOwnProperty(p)) {
                                            this.elm[prop][p] = properties[prop][p];
                                        }
                                    }
                                } else if('textContent' == prop || 'innerText' == prop) { //IE <= 8 && FF 
                                	this.text(properties[prop]);
                            	} else {
                                    this.elm[prop] = properties[prop];
                                }
                            }
                        }
                    }
                    var attributes = arg[2];
                    if(attributes) {
                        this.setAttributes(attributes);
                    }
                    return this.elm;
                }
                this.text = function(string) { 
                	var p = ('textContent' in document.body) ? 'textContent' : 'innerText';
                	if(string) this.elm[p] = string;
                	return this.elm[p];
                },
                this.remove = function(e) { this.elm.removeChild(e); }
                this.append = function(e) { return this.elm.appendChild(e); }
                this.prepend = function(e) { return this.elm.insertBefore(e, this.elm.firstChild); }
                this.setAttributes = function(attributes) {
                    if(typeof attributes === 'object') {
                        for(var a in attributes) {
                            if(attributes.hasOwnProperty(a)) {
                                this.elm.setAttribute(a, attributes[a]);
                            }
                        }
                    }
                }
                this.removeClass = function(className) {
					if(!this.elm.nodeType && !this.elm.className) return;
					var classes = this.elm.className.split(/\s+/);
					for(var i = 0; i < classes.length; i++) {
						if(classes[i] == className) {
							classes.pop(i);
						}
					}
					this.elm.className = classes.join(' ');
					return this;
				}
                this.addClass = function(className) {
                	if(!this.elm.nodeType) return;
                    var current = this.elm.className;
                    if(current.length == 0) {
                        this.elm.className = className;
                    } else if(!(this.hasClass(className))) {
                        this.elm.className = [current, className].join(' ');
                    }
                    return this;
                }
                this.hasClass = function(className) {
                	return this.elm.className && this.elm.className.indexOf(className) >= 0;
                }
                this.show = function() { this.elm.style.display = 'block'; }
                this.hide = function() { this.elm.style.display = 'none'; }
                this.on = function(eventTypes, handler) {
                	var types = eventTypes.split(/\s+/);
                	if(this.elm.addEventListener) {
                		for(var i in types){
	                		this.elm.addEventListener(types[i], handler, true);
	                	} 
	                } else if(this.elm.attachEvent) {
	                	for(var i in types){
	                		this.elm.attachEvent("on" + types[i], handler);
	                	}
                	}
                }
                this.off = function(eventTypes, handler) {
                	var types = eventTypes.split(/\s+/);
                	if(this.elm.removeEventListener) {
                		for(var i in types){
	                		this.elm.removeEventListener(types[i], handler, true);
	                	} 
	                } else if(this.elm.detachEvent) {
	                	for(var i in types){
	                		this.elm.detachEvent("on" + types[i], handler);
	                	}
                	}
                }
                this.cssSupported = function(prop) {
                	var prefixes = ['webkit', 'moz', 'ms', 'o'], p = prop;
                	var isSupported = function(p) { return p !== 'none' && p !== undefined && p !== 'none'; };
                	if(this.elm.currentStyle) { //IE
                		return isSupported(this.elm.currentStyle[prop]);          		
                	}
					var suffix = p.charAt(0).toUpperCase() + p.slice(1);
                	if(window.getComputedStyle) {
                		var s = window.getComputedStyle(this.elm, null);
                		if(isSupported(s[prop])) {
                			return true;
                		}
                		for(var i = 0; i < prefixes.length; i++) {
                			var vendor = prefixes[i] + suffix;
                			if(isSupported(s[vendor])) {
                				return true;
                			}
                		}
                	} else {
                		var s = this.elm.style;
                		for(var i = 0; i < prefixes.length; i++) {
                			var vendor = prefixes[i] + suffix;
                			if(isSupported(s[vendor])) {
                				return true;
                			}
                		}
                	}
                }
                return this;
            }
            var Collection = function(c) {
            	this.collection = c;
            	this.forEach = function(handler) {
					for(var i = 0; i < this.collection.length; i++) {
						handler.call(this, this.collection[i], i);
					}
                }
                this.contains = function(element) {
                	if(Array.prototype.indexOf) return this.collection.indexOf(element) >= 0;
                	for(var i in this.collection) {
                		if(this.collection[i] === element) return true;
                	}
                	return false;
                }

                return this;
            }
            var isNodeList = function(obj) {
			    var str = Object.prototype.toString.call(obj);
			    return typeof obj === 'object' &&
			        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(str) && obj.length &&	        
			        (obj.length === 0 || (typeof obj[0] === "object" && obj[0].nodeType > 0));
			}
			$.isArray = function(obj) {
				return obj && Object.prototype.toString.call(obj) === '[object Array]';
			}
            if(typeof arguments[0] === 'string') {
                return new Element().create(arguments);
            } else if(arguments[0] && (isNodeList(arguments[0]) || $.isArray(arguments[0]))) {
            	return new Collection(arguments[0]);
            } else if(arguments[0] && arguments[0].nodeType) {
                return new Element(arguments[0]);
            }
            return this;
        }
    })(window);

    /*	
    *	Utility function: highlights lines changing
    *	its background color.
    */
	var highlightLines = function(emp) {
		var backLines = emp.back.firstChild.childNodes;
		var codeLines = emp.codeElm.firstChild.firstChild.childNodes;
		var ruler = emp.ruler.childNodes;

		for(var i = 0; i < emp.opt.highlightLines.length; i++) {
			var hl = emp.opt.highlightLines[i] - emp.opt.startLineNumber;
			
			if(codeLines[hl]) $(codeLines[hl]).addClass('emp-highlighted');
			if(backLines[hl]) $(backLines[hl]).addClass('emp-highlighted');
			if(ruler[hl]) $(ruler[hl]).addClass('emp-highlighted');	
		}
	}

	/**************************************
	*	Manages XMLHttpRequest used to
	*	asynchronously load script files
	***************************************/
	var Xhr = function(url, callback) {
        this.request = function() {
            try {
                this.xhr = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                this.xhr.open("GET", url, true);
                this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                this.xhr.setRequestHeader('Content-type', 'text/xml');
                this.xhr.onreadystatechange = this.handler;
                this.xhr.send(null);
            } catch(e) {
                window.console && console.log(e);
            }
        }

        this.handler = function() {
    		if(this.readyState == 3 && callback) {
    			callback(this.responseText);
    		}
        }   
        return this.request();
    }

    /*********************************************
    *	API of the Emphasizer class.
    *	Provided methods could be colled on the 
    *	instance asynchroounously, thus when
    *	the page is completely loaded.
	**********************************************/

    /*
    *	This method sets the file name displayed
    *	onto the toolbar.
    */
    Emphasizer.prototype.setFileName = function(name) {
    	this.opt.toolbar = true;
		if(this.isReady()) {
			if(this.toolbar) {
				$(this.toolbar.firstChild).text(name);
			}
		} else {
			this.opt.fileName = name;
		}
    }

    /*
    *	Sets a callback function to be called
    *	when Emphasizer is completely loaded.
    */
    Emphasizer.prototype.setCallback = function(cb) {
    	this.callback = cb;
    }

    /*
    *	Returns a nodeList containing each
    *	node referenced by the selector argument.
    */
    Emphasizer.prototype.getNodes = function() {
    	return this.nodes;
    }

    /*
    *	Highlights each line provided by the
    *	argument list, i.e..
    */
	Emphasizer.prototype.highlightLines = function() {
		
		var lines = this.opt.highlightLines;
		if(lines) {
			this.opt.highlightLines = lines.concat(arguments);
		} else {
			this.opt.highlightLines = arguments;
		}

		if(this.isReady()) {
			highlightLines(this);
		}
	}

	/*
    *	Returns true if all nodes are ready (highlighted)
    */
	Emphasizer.prototype.isReady = function() { 
		return this.ready === this.nodes.length;
	}

	/*
    *	Sets the theme overriding the one set
    *	by options, adding the required file
    *	to the <head> section.
    */
	Emphasizer.prototype.setTheme = function(theme) {
		if(this.wrapper) {
			$(this.wrapper).removeClass('emp-' + this.opt.theme);
			$(this.wrapper).addClass('emp-' + theme);
		}
		this.opt.theme = theme;
		utils.addStylesheet(Emphasizer.filePath + 'themes/emp-' + theme + '.css');
	}

	/*
    *	Returns an array containing available themes.
    */
	Emphasizer.prototype.getAvailableThemes = function() {
		return this.themes;
	}

	/*
    *	Returns the current theme.
    */
	Emphasizer.prototype.getCurrentTheme = function() {
		return this.opt.theme;
	}

	/*
    *	Returns the current options.
    */
	Emphasizer.prototype.getOptions = function() {
		return this.opt;
	}


	/**********************************
	*	Helper methods
	***********************************/

	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}

	String.prototype.splitAndKeep = function(regexp) {

        var offsets = [], result = [], obj;

        this.replace(regexp, function(m, key, value) {
            offsets.push({match: key, offset: value})
        });

        if(offsets.length == 0) {
        	result.push(this);
        } else {

	        for(var i = 0, start = 0; i < offsets.length; i++) {
	            obj = offsets[i];
	            var substring = this.substring(start, obj.offset);
	            if(substring !== '') {
	                result.push(substring);
	            }
	            result.push(obj.match);
	            start = obj.offset + obj.match.length;
	        }

	        if(obj && obj.offset < this.length) {
	            result.push(this.substring(obj.offset + obj.match.length));
	        }
	    }
        return result;
    }

	String.prototype.isEmpty = function() {
		return this.length == 0;
	}

	String.prototype.isWhiteSpace = function() {
		return this == '\u0020' || this == '\u0009'; /*space or tab*/
	}

	Array.prototype.filterElement = function(value) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === value) {
				this.splice(i, 1);
			}
		}
		return this;
	}

	Array.prototype.pushToken = function(type, value) {
		return this.push(new Token(type, value));
	}

	Array.prototype.refine = function(func) {
		func.call(this, this);
	}

	/* The instance is returned */
	return this.Emphasizer();
};







