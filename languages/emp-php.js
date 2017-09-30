/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-php.js
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

Emphasizer.language.php = {
	postProcess: function(tokenized) {
		var parse = {
			classDefinitionName: function(tkz, i) {
				if(tkz[i].has('class')) {
					i += 2;
					if(tkz[i] && tkz[i].is('types')) {
						tkz[i].type = 'className';
					}
				}
			},
			method: function(tkz, i) {
				if(tkz[i].has('function')) {
					if(tkz[i + 2] && tkz[i + 2].is('plain')) {
						tkz[i + 2].type = 'method';
					}
				}
			},
			heredoc: function(tkz, i) {
				if(tkz[i].is('heredoc')) {
					var id = tkz[++i].value;
					while(tkz[i++] && !tkz[i].has(id)) {
						if(!tkz[i].is('spaces') && !tkz[i].has('\n')) {
							tkz[i].type = 'string';
						}
					}
				}
			},
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++) {
					parse.heredoc(tkz, i);
					Emphasizer.language.commons.comments(tkz, i, '/*', '*/');
					Emphasizer.language.commons.strings(tkz, i);
					parse.classDefinitionName(tkz, i);
					parse.method(tkz, i);								
				}
			}
		};
		parse.all(tokenized);
	},
	regex: {
		comment: "\\/\\/.* \\/\\* \\*\\/",
		string: "\" \'",
		escapeChar: "\\\\.",
		keyword: "and as callable class clone const declare empty extends final function global implements include include_once " +
				 "instanceof insteadof interface namespace or parent print require require_once static trait use var xor yield",
		statement: "new return default break continue if foreach for while try catch finally do switch case goto assert elseif else " +
				   "throw throws enddeclare endfor endforeach endif endswitch endwhile",
		modifier: "public protected private abstract synchronized final static",
		reservedMethod: "echo isset __halt_compiler array die eval exit isset list unset",
		reservedConstant: "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__",
		variable: "\\$[A-Za-z0-9_]+",
		literal: "null true false",
		keywordSpecial: "this super",
		parenthesis: '\\{ \\[ \\( \\) \\] \\}',
		heredoc: "<<<",
		operator: ":: " + Emphasizer.language.commons.cstyle.regex.operator,
		digit: "[0-9]+",
		constant: "[A-Z0-9]+[A-Z0-9_]+",
		types: "([A-Z]+[a-z0-9]*)+[A-Z]*",
		specialTag: "<\\?php <\\? \\?> \\&lt;\\?php \\?\&gt;"
	},
	splitTokens: ["specialTag", "comment", "string", "escapeChar", "variable", "heredoc", "parenthesis", "operator"],
	inlineCodeTags: { open: '\\&lt;\\?php|<\\?php|<!--\\?php', close: '\\?\\&gt;|\\?>|\\?-->', tagLanguage: 'php'},
	escape: function(c) {
		return c.replace(/<!--/, '<').replace(/-->/, '>');
	}
}








