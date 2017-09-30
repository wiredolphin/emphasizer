/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-cpp.js
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

Emphasizer.language.cpp = {
	postProcess: function(tokenized) {
		var libraryFunctions = 
			"^(_Exit|abort|abs|acos|acosh|addressof|adjacent_find|advance|align|all_of|allocate_shared|any_of|" +
			"arg|asctime|asin|asinh|assert|async|at_quick_exit|atan|atan2|atanh|atexit|atof|atoi|atol|atoll|" +
			"atomic_compare_exchange_strong|atomic_compare_exchange_strong_explicit|atomic_compare_exchange_weak|" +
			"atomic_compare_exchange_weak_explicit|atomic_exchange|atomic_exchange_explicit|atomic_fetch_add|" +
			"atomic_fetch_add_explicit|atomic_fetch_and|atomic_fetch_and_explicit|atomic_fetch_or|atomic_fetch_or_explicit|" +
			"atomic_fetch_sub|atomic_fetch_sub_explicit|atomic_fetch_xor|atomic_fetch_xor_explicit|atomic_flag_clear|" +
			"atomic_flag_clear_explicit|atomic_flag_test_and_set|atomic_flag_test_and_set_explicit|atomic_init|" +
			"atomic_is_lock_free|atomic_load|atomic_load_explicit|atomic_signal_fence|atomic_store|atomic_store_explicit|" +
			"atomic_thread_fence|back_inserter|begin|binary_search|bind|bsearch|btowc|c16rtomb|c32rtomb|call_once|calloc|" +
			"cbrt|ceil|clearerr|clock|conj|const_pointer_cast|copy|copy_backward|copy_if|copy_n|copysign|cos|cosh|count|" +
			"count_if|cref|ctime|current_exception|declare_no_pointers|declare_reachable|declval|delete|difftime|distance|" +
			"div|duration_cast|dynamic_pointer_cast|end|equal|equal_range|erf|erfc|errno|exit|exp|exp2|expm1|fabs|fclose|" +
			"fdim|feclearexcept|fegetenv|fegetexceptflag|fegetround|feholdexcept|feof|feraiseexcept|ferror|fesetenv|" +
			"fesetexceptflag|fesetround|fetestexcept|feupdateenv|fflush|fgetc|fgetpos|fgets|fgetwc|fgetws|fill|fill_n|" +
			"find|find_end|find_first_of|find_if|find_if_not|floor|fma|fmax|fmin|fmod|fopen|for_each|forward|forward_as_tuple|" +
			"fpclassify|fprintf|fputc|fputs|fputwc|fputws|fread|free|freopen|frexp|front_inserter|fscanf|fseek|fsetpos|ftell|" +
			"future_category|fwide|fwprintf|fwrite|fwscanf|generate|generate_n|generic_category|get|get_deleter|get_new_handler|" +
			"get_pointer_safety|get_temporary_buffer|get_terminate|get_unexpected|getc|getchar|getenv|gets|getwc|getwchar|gmtime|" +
			"hypot|ilogb|imag|includes|inplace_merge|inserter|is_heap|is_heap_until|is_partitioned|is_permutation|is_sorted|" +
			"is_sorted_until|isalnum|isalpha|isblank|iscntrl|isdigit|isfinite|isgraph|isgreater|isgreaterequal|isinf|isless|" +
			"islessequal|islessgreater|islower|isnan|isnormal|isprint|ispunct|isspace|isunordered|isupper|iswalnum|iswalpha|" +
			"iswblank|iswcntrl|iswctype|iswdigit|iswgraph|iswlower|iswprint|iswpunct|iswspace|iswupper|iswxdigit|isxdigit|" +
			"iter_swap|jmp_buf|kill_dependency|labs|ldexp|ldiv|lexicographical_compare|lgamma|llabs|lldiv|llrint|llround|" +
			"localeconv|localtime|lock|log|log10|log1p|log2|logb|longjmp|lower_bound|lrint|lround|make_error_code|make_error_condition|" +
			"make_exception_ptr|make_heap|make_move_iterator|make_pair|make_shared|make_tuple|malloc|max|max_element|mblen|mbrlen|" +
			"mbrtoc16|mbrtoc32|mbrtowc|mbsinit|mbsrtowcs|mbstowcs|mbtowc|mem_fn|memchr|memcmp|memcpy|memmove|memset|merge|min|" +
			"min_element|minmax|minmax_element|mismatch|mktime|modf|move|move_backward|move_if_noexcept|nan|nanf|nanl|nearbyint|" +
			"new|next|next_permutation|nextafter|nexttoward|none_of|norm|not1|not2|nth_element|partial_sort|partial_sort_copy|" +
			"partition|partition_copy|partition_point|perror|polar|pop_heap|pow|prev|prev_permutation|printf|proj|push_heap|" +
			"putc|putchar|puts|putwc|putwchar|qsort|quick_exit|raise|rand|random_shuffle|real|realloc|ref|regex_match|regex_replace|" +
			"regex_search|remainder|remove|remove_copy|remove_copy_if|remove_if|remquo|rename|replace|replace_copy|replace_copy_if|" +
			"replace_if|rethrow_exception|rethrow_if_nested|return_temporary_buffer|reverse|reverse_copy|rewind|rint|rotate|rotate_copy|" +
			"round|scalbln|scalbn|scanf|search|search_n|set_difference|set_intersection|set_new_handler|set_symmetric_difference|" +
			"set_terminate|set_unexpected|set_union|setbuf|setjmp|setlocale|setvbuf|shuffle|signal|signbit|sin|sinh|snprintf|sort|" +
			"sort_heap|sprintf|sqrt|srand|sscanf|stable_partition|stable_sort|static_pointer_cast|stod|stof|stoi|stol|stold|stoll|" +
			"stoul|stoull|strcat|strchr|strcmp|strcoll|strcpy|strcspn|strerror|strftime|strlen|strncat|strncmp|strncpy|strpbrk|strrchr|" +
			"strspn|strstr|strtod|strtof|strtok|strtol|strtold|strtoll|strtoul|strtoull|strxfrm|swap|swap_ranges|swprintf|swscanf|" +
			"system|system_category|tan|tanh|terminate|tgamma|throw_with_nested|tie|time|time_point_cast|tmpfile|tmpnam|to_string|" +
			"to_wstring|tolower|toupper|towctrans|towlower|towupper|transform|trunc|try_lock|tuple_cat|uncaught_exception|" +
			"undeclare_no_pointers|undeclare_reachable|unexpected|ungetc|ungetwc|uninitialized_copy|uninitialized_copy_n|" +
			"uninitialized_fill|uninitialized_fill_n|unique|unique_copy|upper_bound|vfprintf|vfscanf|vfwprintf|vfwscanf|vprintf|" +
			"vscanf|vsnprintf|vsprintf|vsscanf|vswprintf|vswscanf|vwprintf|vwscanf|wcrtomb|wcscat|wcschr|wcscmp|wcscoll|wcscpy|" +
			"wcscspn|wcsftime|wcslen|wcsncat|wcsncmp|wcsncpy|wcspbrk|wcsrchr|wcsrtombs|wcsspn|wcsstr|wcstod|wcstof|wcstok|wcstol|wcstold|" +
			"wcstoll|wcstombs|wcstoul|wcstoull|wcsxfrm|wctob|wctomb|wctrans|wctype|wmemchr|wmemcmp|wmemcpy|wmemmove|wmemset|wprintf|wscanf)$";
		var parse = {
			directives: function(tkz, i) {
				if(tkz[i].has('include')) {
					i += 2;
					if(tkz[i] && /(\"|\'|<)/.test(tkz[i].value)) {
						tkz[i].type = 'header';
						while(tkz[++i] && !/(\"|\'|>)/.test(tkz[i].value)) {
							tkz[i].type = 'header';
						}
						tkz[i].type = 'header';
					}
				} else if(tkz[i].has('define')) {
					i += 2;
					if(tkz[i]) {
						tkz[i].type = 'macro';
						while(tkz[++i] && !tkz[i].has('\n')) {
							if(!tkz[i].is('spaces')) tkz[i].type ='macroValue';
						}
					}
				}
			},
			methods: function(tkz, i) {
				if(tkz[i].has('(')) {
					if(tkz[--i] && tkz[i].is('spaces')) --i;
					if(new RegExp(libraryFunctions).exec(tkz[i].value)) {
						tkz[i].type = 'libraryFunction';
					} else if (tkz[i].is('plain')) {
						tkz[i].type = 'method';
						if(tkz[--i] && tkz[i].has('::') && tkz[i - 1] && !tkz[i - 1].is('spaces')) {
							tkz[i].type = 'method';
							tkz[i - 1].type = 'method';
						}					
					}
				}
			},
			properties: function(tkz, i) {
				if(tkz[i].has('.')) {				
					var j = i;
					if(tkz[++j] && tkz[j].is('plain')) {
						if(tkz[++j] && tkz[j].is('spaces')) ++j;
						if(!tkz[j].has('(')) {
							tkz[i].type = 'property';
							tkz[++i].type = 'property';
						}
					}
				}
			},
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++) {					
					Emphasizer.language.commons.comments(tkz, i, '/*', '*/');
					Emphasizer.language.commons.cstyle.strings(tkz, i);
					parse.directives(tkz, i);
					parse.methods(tkz, i);
					parse.properties(tkz, i);
				}
			}
		};
		parse.all(tokenized);
	},
	regex: {
		comment: "\\/\\/.* \\/\\* \\*\\/",
		string: "\" \'",
		escapeChar: "\\\\.",	
		formatSpecifier: "%[-+#\\*]*\\d*\\.*\\d*[diuoxXfFeEgGaAcspn]",
		hash: "#",
		directive: "include define",
		primitive: "bool char int float double void wchar_t char16_t char32_t clock_t size_t time_t",
		typeModifier: "unsigned signed short long",
		keyword: "class alignas alignof asm auto compl constexpr decltype enum explicit export extern friend inline mutable namespace " +
				 "register requires static_assert struct template thread_local typedef typename union volatile virtual",
		statement: "break case catch continue default do else for goto if operator return switch throw try using while",
		modifier: "public protected private abstract const static",
		literal: "null true false nullptr",
		keywordSpecial: "this super",
		parenthesis: "\\{ \\[ \\( \\) \\] \\}",
		operator: ":: " + Emphasizer.language.commons.cstyle.regex.operator,
		digit: "[0-9]+",
		type: "([A-Z]+[a-z0-9_]+)+[A-Z]*",
		specialOperator: "bitand bitor and_eq and const_cast dynamic_cast reinterpret_cast static_cast " +
						 "not not_eq or or_eq delete xor xor_eq new sizeof noexcept typeid"
	},
	splitTokens: ["comment", "string", "escapeChar", "formatSpecifier", "hash", "parenthesis", "operator"],
	escape: function(c) {
		return c.replace(/\&gt;/, '>').replace(/\&lt;/, '<');
	}
}


