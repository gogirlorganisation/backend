var proc = require('child_process');

var procName = './faketty.sh';
var procOpts = 'python3 -i';

if(process.env.NODE_ENV === 'production') {
	procName = 'firejail';
	procOpts = '--profile=sandbox/tgc.profile ./faketty.sh ' + procOpts;
}

var options = procOpts.split(' ');

module.exports = function(socket) {
	var child = proc.spawn(procName, options, {
		shell: false,
		detatched: true
	});

	child.stdout.setEncoding('utf8');

	child.stderr.setEncoding('utf8');

	child.stdin.on('error', function(e) {
		debug(e.stack);
	});

	child.on('exit', function(exitCode) {
		if(!child.killed)
			gracefulExit = true;
		if(socket) socket.emit('end', 'Program exited with code ' + exitCode);
	});

	return child;
}