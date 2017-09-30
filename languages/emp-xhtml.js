/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-xhtml.js
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

Emphasizer.language.xhtml = {
	postProcess: function(tokenized) {
		var parse = {
			attribute: function(tkz, i) {
				if(/^<[^>]+$/.test(tkz[i].value)) {
					while(tkz[++i] && !/\/?>/.test(tkz[i].value)) {

						Emphasizer.language.commons.strings(tkz, i);
						
						if(tkz[i].is('plain')) {
							tkz[i].type = 'attribute';
						}						
					}
				}
			},
			specialTagGt: function(tkz, i) {
				if(tkz[i].is('specialTag')) {
					while(tkz[++i] && !tkz[i].has('>'));
					if(tkz[i]) tkz[i].type = 'specialTag';
				}
			},
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++) {
					Emphasizer.language.commons.comments(tkz, i, '<!--', '-->');					
					parse.attribute(tkz, i);
					parse.specialTagGt(tkz, i);
				}
			}	
		};
		parse.all(tokenized);
	},
	regex: {
		comment: "<\\!-{2} -{2}>",
		quote: "\" \'",
		escapeChar: "\\\\.",
		specialTag: "<\/?script>? <\/?style>? \&lt;\?php <\\?php <\\? \\?> <\\!DOCTYPE\\shtml",
		tag: "<[^>\\s]*>? <\\/[^>] \\/?\\s*>",		
		operator: "="
	},
	splitTokens: ["comment", "specialTag", "tag", "quote", "escapeChar", "operator"],
	escape: Emphasizer.language.commons.xhtml.escape
}


