var fs = require('fs');
var process = require('child_process');

function rand() {
	return Math.floor(Math.random() * 1000);
}

module.exports = function(code, socket) {
	var fileName = rand() + '_' + Date.now();
	fs.writeFileSync(fileName + '.py', code);
	var child = process.spawn('python3', ['-u', '-m', fileName], {
		shell: true,
		detatched: true
	});

	child.stdout.setEncoding('utf8');

	child.stderr.setEncoding('utf8');

	child.on('exit', function(exitCode) {
		if(socket) socket.emit('end', 'Program exited with code ' + exitCode);
		fs.unlinkSync(fileName + '.py');
	});


	return child;
};