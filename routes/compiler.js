var fs = require('fs');
var proc = require('child_process');
var debug = require('debug');

function rand() {
	return Math.floor(Math.random() * 1000);
}

var procName = 'python3';
var procOpts = '-u -I';
var directory = './';

// if(process.env.NODE_ENV === 'production') {
// 	procName = 'firejail';
// 	procOpts = '--profile=sandbox/tgc.profile python3 ' + procOpts;
// 	directory = '/tmp/';
// }

module.exports = function(code, socket) {
	var fileName = rand() + '_' + Date.now();
	var filePath = directory + fileName;
	fs.writeFileSync(filePath + '.py', code);

	/*	code +=
'import sys\n\
sys.modules[os] = None\n\n';*/

	var options = procOpts.split(' ');
	options[options.length] = filePath + '.py';

	var gracefulExit = false;

	try {
		var child = proc.spawn(procName, options, {
			shell: true
		});

		child.stdout.setEncoding('utf8');

		child.stderr.setEncoding('utf8');

		child.stdin.on('error', function(e) {
			debug(e.stack);
		});

		setTimeout(function() {
			if (!gracefulExit && !child.killed) child.kill('SIGKILL');
		}, 300 * 1000);

		child.on('exit', function(exitCode) {
			if (!child.killed) gracefulExit = true;
			if (socket) socket.emit('end', 'Program exited with code ' + exitCode);
			fs.unlinkSync(filePath + '.py');
		});

		return child;
	} catch (e) {
		console.log(e);

		return false;
	}
};
