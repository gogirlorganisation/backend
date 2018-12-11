var proc = require('child_process');
var fs = require('fs');

var procName = './faketty.sh';
var procOpts = 'python3 -i -I';

/*if(process.env.NODE_ENV === 'production') {
	procName = 'firejail';
	procOpts = '--profile=sandbox/tgc.profile ./faketty.sh ' + procOpts;
}*/


module.exports = function(socket, prefile) {
	var options = procOpts.split(' ');

	var prefileName = '';

	if(prefile && prefile !== 'none') {
		prefileName = 'prefiles/' + prefile + '.py';
	}

	if(prefileName && fs.existsSync(prefileName)) {
		options[options.length] = prefileName; 
	}
	

	var child = proc.spawn(procName, options, {
		shell: false,
		detatched: true
	});

	child.stdout.setEncoding('utf8');

	child.stderr.setEncoding('utf8');

	child.stdin.on('error', function(e) {
		console.log(e.stack);
	});

	child.on('exit', function(exitCode) {
		if(!child.killed)
			gracefulExit = true;
		if(socket) socket.emit('end', 'Program exited with code ' + exitCode);
	});

	return child;
}