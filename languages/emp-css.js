/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-css.js
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

Emphasizer.language.css = {
	postProcess: function(tokenized) {
		var parse = {
			attributeSelector: function(tkz, i) {
				if(tkz[i] && tkz[i].has('['))  {
					if(tkz[i + 2].is('operator')) {
						tkz[i + 1].type = 'attributeSelector';
					}
				}
			},
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++ ) {
					Emphasizer.language.commons.comments(tkz, i, '/*', '*/');
					Emphasizer.language.commons.strings(tkz, i);
					parse.attributeSelector(tkz, i);
				}
			}		
		};
		parse.all(tokenized);
	},
	regex: {
		comment: "\\/\\/.* \\/\\* \\*\\/",
		string: "\" \'",
		escapeChar: "\\\\.",
		pseudoClass: ":active :{1,2}after ::backdrop :{1,2}before :checked :default :dir :disabled :empty :enabled :first :first-child " +
					 ":{1,2}first-letter :{1,2}first-line :first-of-type :focus :fullscreen :hover :indeterminate :in-range :invalid :lang " +
					 ":last-child :last-of-type :left :link :not :nth-child :nth-last-child :nth-last-of-type :nth-of-type :only-child " +
					 ":only-of-type :optional :out-of-range :read-only :read-write ::repeat-index ::repeat-item :required :right :root :scope " +
					 "::selection :target :unresolved :valid :visited",
		colorHex: "#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}",
		cssClass: "\\.[a-zA-Z0-9_-]+",
		cssId: "#[a-zA-Z0-9_-]+",
		digit: "[0-9]+",
		operator: "\\$\\= \\^\\= \\+ \\* \\- \\/ \\: \\$ \\^ \\= \\> \\~",
		parenthesis: "\\{ \\} \\[ \\] \\( \\)",
		unit: "px pt em rem vw vh vmin vmax ex pc mm cm in ch\\%",
		separator: ",",
		properties: "border-block-end border-block-end-color border-block-end-style border-block-end-width border-block-start " +
					"border-block-start-color border-block-start-style border-block-start-width border-bottom-color border-bottom-left-radius " +
					"border-bottom-right-radius border-bottom-style border-bottom-width border-collapse border-color border-image-outset " +
					"border-image-repeat border-image-slice border-image-source border-image-width border-inline-end border-inline-end-color border-inline-end-style " +
					"border-inline-end-width border-inline-start border-inline-start-color border-inline-start-style border-inline-start-width border-left " +
					"border-left-color border-left-style border-left-width border-radius border-right border-right-color border-right-style border-right-width " +
					"border-spacing border-style border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width " +
					"border-width border-top border-image border-bottom " +
					"additive-symbols align-content align-items align-self all animation animation-delay animation-direction " + 
					"animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function " +
					"@annotation annotation attr backface-visibility background-attachment background-blend-mode background-clip " +
					"background-color background-image background-origin background-position background-repeat background-size background " +
					"block-size blur border bottom box-decoration-break box-shadow box-sizing break-after break-before break-inside brightness caption-side " +
					"@character-variant character-variant @charset circle clear clip clip-path color columns column-count column-fill column-gap " +
					"column-rule column-rule-color column-rule-style column-rule-width column-span column-width content contrast counter-increment " +
					"counter-reset @counter-style cubic-bezier cursor deg direction display @document dpcm dpi dppx drop-shadow element ellipse " +
					"empty-cells fallback filter flex flex-basis flex-direction flex-flow flex-grow flex-shrink flex-wrap float @font-face font-family " +
					"font-family font-feature-settings @font-feature-values font-kerning font-language-override font-size font-size-adjust font-stretch font-stretch " +
					"font-style font-style font-synthesis font-variant font-variant font-variant-alternates font-variant-caps font-variant-east-asian " +
					"font-variant-ligatures font-variant-numeric font-variant-position font-weight font-weight font grad grayscale grid grid-area " +
					"grid-auto-columns grid-auto-flow grid-auto-position grid-auto-rows grid-column grid-column-start grid-column-end grid-row grid-row-start " +
					"grid-row-end grid-template grid-template-areas grid-template-rows grid-template-columns height height hsl hsla hue-rotate hyphens hz " +
					"image image-rendering image-resolution image-orientation ime-mode @import inherit initial inline-size inset invert isolation " +
					"justify-content @keyframes khz left letter-spacing linear-gradient line-break line-height list-style list-style-image list-style-position " +
					"list-style-type margin-block-end margin-block-start margin-bottom margin-inline-end margin-inline-start margin-left margin-right margin-top margin " +
					"marks mask mask-type matrix matrix3d max-block-size max-height max-height max-inline-size max-width max-width max-zoom @media min-block-size " +
					"min-height min-height min-inline-size minmax min-width min-width min-zoom mix-blend-mode ms @namespace negative object-fit " +
					"object-position offset-block-end offset-block-start offset-inline-end offset-inline-start opacity opacity order orientation @ornaments ornaments " +
					"orphans outline outline-color outline-offset outline-style outline-width overflow overflow-wrap overflow-x overflow-y padding padding-block-end " +
					"padding-block-start padding-bottom padding-inline-end padding-inline-start padding-left padding-right padding-top pad @page page-break-after " +
					"page-break-before page-break-inside perspective perspective perspective-origin pointer-events polygon position " +
					"prefix quotes radial-gradient range rect repeat repeating-linear-gradient repeating-radial-gradient resize " +
					"rgb rgba right rotate rotatex rotatey rotatez rotate3d ruby-align ruby-merge ruby-position saturate scale scalex scaley scalez " +
					"scale3d scroll-behavior scroll-snap-coordinate scroll-snap-destination scroll-snap-points-x scroll-snap-points-y scroll-snap-type scroll-snap-type-x " +
					"scroll-snap-type-y sepia shape-image-threshold shape-margin shape-outside skew skewx skewy speak-as src steps @styleset " +
					"styleset @stylistic stylistic suffix @supports @swash swash symbols symbols system table-layout tab-size text-align text-align-last " +
					"text-combine-upright text-decoration text-decoration-color text-decoration-line text-decoration-style text-indent text-orientation text-overflow " +
					"text-rendering text-shadow text-transform text-underline-position top touch-action transform transform-box transform-origin " +
					"transform-style transition transition-delay transition-duration transition-property transition-timing-function translate translatex translatey " +
					"translatez translate3d turn unicode-bidi unicode-range unset user-zoom var vertical-align vh @viewport visibility " +
					"white-space widows width width will-change word-break word-spacing word-wrap writing-mode z-index zoom rad s",
		value: "above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block bold bolder " +
				"both bottom braille capitalize caption center center-left center-right circle close-quote collapse compact condensed " +
				"continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double " +
				"embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia " +
				"groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic " +
				"justify landscape large larger left-side left leftwards level lighter line-through list-item local loud lower-alpha " +
				"lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower " +
				"ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique once open-quote outset " +
				"outside overline pointer portrait pre print projection relative repeat repeat-x repeat-y rgb ridge right right-side " +
				"rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent slower slow " +
				"small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize " +
				"table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal " +
				"text-bottom text-top thick thin top tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin " +
				"upper-roman visible wait wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small",
		color: "aliceBlue antiqueWhite aqua aquamarine azure beige bisque black blanchedAlmond blue blueViolet brown burlyWood cadetBlue chartreuse " +
			   "chocolate coral cornflowerBlue cornsilk crimson cyan darkBlue darkCyan darkGoldenRod darkGray darkGrey darkGreen darkKhaki darkMagenta " +
			   "darkOliveGreen darkorange darkOrchid darkRed darkSalmon darkSeaGreen darkSlateBlue darkSlateGray darkSlateGrey darkTurquoise darkViolet " +
			   "deepPink deepSkyBlue dimGray dimGrey dodgerBlue fireBrick floralWhite forestGreen fuchsia gainsboro ghostWhite gold goldenRod gray grey " +
			   "Green GreenYellow HoneyDew HotPink IndianRed Indigo Ivory Khaki Lavender LavenderBlush LawnGreen LemonChiffon LightBlue LightCoral LightCyan " +
			   "lightGoldenRodYellow lightGray lightGrey lightGreen lightPink lightSalmon lightSeaGreen lightSkyBlue lightSlateGray lightSlateGrey lightSteelBlue " +
			   "lightYellow lime limeGreen linen magenta maroon mediumAquaMarine mediumBlue mediumOrchid mediumPurple mediumSeaGreen mediumSlateBlue mediumSpringGreen " +
			   "mediumTurquoise mediumVioletRed midnightBlue mintCream mistyRose moccasin navajoWhite navy oldLace olive oliveDrab orange orangeRed orchid paleGoldenRod " +
			   "paleGreen paleTurquoise paleVioletRed papayaWhip peachPuff peru pink plum powderBlue purple red rosyBrown royalBlue saddleBrown salmon sandyBrown seaGreen " +
			   "seaShell sienna silver skyBlue slateBlue slateGray slateGrey snow springGreen steelBlue tan teal thistle tomato turquoise violet wheat white whiteSmoke " +
			   "yellow yellowGreen transparent",
		font: "[aA]rial [cC]harcoal [cC]ourier [cC]ursive [gG]adget [gG]eneva [gG]eorgia [hH]elvetica [iI]mpact Palatino [sS]ans-serif " +
		      "[sS]erif [tT]ahoma [tT]imes [vV]erdana monospace [mM]onaco",
		vendorPrefix: "-ms- mso- -moz- -o- -atsc- -wap- -webkit- -khtml-",
		specialTag: "<\/?style>?"	
	},
	splitTokens: ["specialTag", "comment", "string", "separator", "font", "pseudoClass", "attributeSelector", 
				  "cssClass", "cssId", "value", "color", "properties", "vendorPrefix", "operator", "parenthesis", "unit", "digit"],
	inlineCodeTags: { open: '<style[^>]*>', close: '<\/style>', tagLanguage: 'xhtml' }
}


