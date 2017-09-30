/*
*	Emphasizer - Smart source code syntax highlighter
*	For more info visit http://emphasizer.net
*	File: emp-bash.js
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

Emphasizer.language.bash = {
	postProcess: function(tokenized) {
		var parse = {
			all: function(tkz) {
				for(var i = 0; i < tkz.length; i++) {					
					Emphasizer.language.commons.strings(tkz, i, 'variable');
				}
			}
		};
		parse.all(tokenized);
	},
	regex: {
		shebang: "#\\!\\/?[a-z]+\\/?[a-z]*",
		comment: "#.*",
		string: "\" \'",
		backtick: "`",
		escapeChar: "\\\\.",
		keyword: "in function time coproc",
		statement: "if then else elif fi case esac for select while until do done",
		builtInCommand: "alias apropos apt-get aptitude aspell awk basename bash bc bg break builtin bzip2 cal cat cd cfdisk " +
				"chgrp chmod chown chroot chkconfig cksum clear cmp comm command continue cp cron crontab csplit cut date " +
				"dc dd ddrescue declare df diff diff3 dig dir dircolors dirname dirs dmesg du echo egrep eject enable env " +
				"ethtool eval exec exit expect expand export expr false fdformat fdisk fg fgrep file find fmt fold format " +
				"free fsck ftp function fuser gawk getopts grep groupadd groupdel groupmod groups gzip hash head help history " +
				"hostname htop iconv id ifconfig ifdown ifup import install ip jobs join kill killall less let link ln local " +
				"locate logname logout look lpc lpr lprint lprintd lprintq lprm ls lsof make man mkdir mkfifo mkisofs mknod more " +
				"most mount mtools mtr mv mmv netstat nice nl nohup notify-send nslookup open op passwd paste pathchk ping pkill " +
				"popd pr printcap printenv printf ps pushd pv pwd quota quotacheck quotactl ram rar rcp read readarray readonly " +
				"reboot rename renice remsync return rev rm rmdir rsync screen scp sdiff sed seq set sftp shift shopt shutdown " +
				"sleep slocate sort source split ssh stat strace su sudo sum suspend sync tail tar tee test time timeout times touch " +
				"top tput traceroute trap tr true tsort tty type ulimit umask umount unalias uname unexpand uniq units unrar unset " +
				"unshar uptime useradd userdel usermod users uuencode uudecode v vdir vi vmstat wait watch wc whereis which " +
				"who whoami wget write xargs xdg-open yes zip",
		literal: "null true false nullptr",
		parenthesis: "\\{ \\[{1,2} \\( \\) \\]{1,2} \\}",
		operator: Emphasizer.language.commons.cstyle.regex.operator + " \\*{1,2}",
		digit: "[0-9]+",
		flag: "-[A-Z]?[a-z]{0,2}",
		variable: "\\${?[A-Za-z0-9_]+}?",
	},
	splitTokens: ["shebang", "comment", "backtick", "string", "escapeChar", "variable", "parenthesis", "flag", "operator"]
}

