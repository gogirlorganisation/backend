var fs = require('fs');
var proc = require('child_process');

function rand() {
	return Math.floor(Math.random() * 1000);
}

var procName = 'python3';
var procOpts = '-u';
var directory = './';

if(process.env.NODE_ENV === 'production') {
	procName = 'firejail';
	procOpts = '--profile=sandbox/tgc.profile python3 ' + procOpts;
	directory = '/tmp/';
}

module.exports = function(code, socket) {
	var fileName = rand() + '_' + Date.now();
	var filePath = directory + fileName;
	fs.writeFileSync(filePath + '.py', code);

/*	code +=
'import sys\n\
sys.modules[os] = None\n\n';*/

	var options = procOpts.split(' ');
	options[options.length] = filePath + '.py';

	var child = proc.spawn(procName, options, {
		shell: true,
		detatched: true
	});

	child.stdout.setEncoding('utf8');

	child.stderr.setEncoding('utf8');

	child.on('exit', function(exitCode) {
		if(socket) socket.emit('end', 'Program exited with code ' + exitCode);
		fs.unlinkSync(filePath + '.py');
	});


	return child;
};