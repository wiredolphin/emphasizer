/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-java.js
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

Emphasizer.language.java = {
	postProcess: function(tokenized) {		
		var parse = {
			classDefinitionNames: function(tkz, i) {
				if(tkz[i].has('class')) {
					i += 2;
					if(tkz[i] && tkz[i].is('types')) {
						tkz[i].type = 'className';
					}
				}
			},
			fullyQualifiedClassNames: function(tkz, i) {
				if(tkz[i].is('type') || tkz[i].is('constant') || tkz[i].has('*')) {
					if(tkz[i - 1] && tkz[i - 1].has('.')) {
						if(tkz[i].has('*')) {
							tkz[i].type = 'type';
						}
						while(tkz[--i] && !tkz[i].is('spaces')) {
							tkz[i].type = 'fqcn';
						}
					}				
				}
			},
			packages: function(tkz, i) {
				if(tkz[i].has('package')) {
					i++; //skip space
					while(tkz[++i] && !tkz[i].is('spaces') && !tkz[i].has(';')) {
						tkz[i].type = 'fqcn';		
					}
				}
			},
			genericTypes: function(tkz, i) {			
				if(tkz[i].is('type')) {
					if(tkz[++i]) {
						if(tkz[i].has('<')) {
							tkz[i].type = 'type';
							if(tkz[++i]) tkz[i].type = 'type';
						}
						if(/>+/.test(tkz[i].value)) {
							tkz[i].type = 'type';
						}
					}				
				}
			},
			methodsAndArguments: function(tkz, i) {

				var spotArguments = function(tkz, i) {
					while(tkz[++i] && !tkz[i].has(')')) {
						if(tkz[i].is('plain') && !tkz[i].has(',')) {
							tkz[i].type = 'argument';
						}
					}
				}

				if(tkz[i].has('class')) {
					while(tkz[++i] && !tkz[i].has('{'));
					var openings = 1;
					while(++i < tkz.length && !tkz[i].has('class')) {

						if(tkz[i].has('{')) {
							openings++;
						}else if(tkz[i].has('}')) {
							openings--;
							if(openings == 0) openings = 1; //nested class?
						}else if(tkz[i].has('(') && openings == 1) {
							var j = (tkz[i - 1] && tkz[i - 1].is('spaces')) ? i - 2 : i - 1;
							if(!tkz[j - 2].has('new')) {
								tkz[j].type = 'method';
							}
							spotArguments(tkz, i);										
						}
					}
				}
			},
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++ ) {
					Emphasizer.language.commons.comments(tkz, i, '/*', '*/');
					Emphasizer.language.commons.strings(tkz, i);
					parse.packages(tkz, i);
					parse.classDefinitionNames(tkz, i);
					parse.fullyQualifiedClassNames(tkz, i);
					parse.genericTypes(tkz, i);	
					parse.methodsAndArguments(tkz, i);
				}
			}
		};		
		parse.all(tokenized);	
	},
	regex: {	
		comment: "\\/\\/.* \\/\\* \\*\\/",
		string: "\" \'",
		escapeChar: "\\\\.",
		directive: "import package",
		keyword: "class const enum extends instanceof interface void " +
				 "implements native strict volatile transient",
		keywordValue: "null true false",
		keywordSpecial: "super this",
		statement: "return break continue if for while try default catch finally do switch case goto assert else throw throws",
		modifier: "public protected private abstract// synchronized final static",
		operator: Emphasizer.language.commons.cstyle.regex.operator,
		parenthesis: '\\{ \\[ \\( \\) \\] \\}',
		digit: "[0-9]+",
		primitive: "int double float byte char boolean short long",
		constant: "[A-Z0-9]+[A-Z0-9_]+",
		type: "([A-Z]+[a-z0-9_]+)+[A-Z]*",		
	},
	splitTokens: ["comment", "string", "escapeChar", "operator", "parenthesis", "digit"],
	escape: function(content) {
		return content.replace(/(<\/.*>|\&gt;)/ig, function(m) { 
			if(m == '&gt;') return '>';
			return ''; 
		});
	}
}
