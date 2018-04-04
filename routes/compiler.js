module.exports = function(io) {

var express = require('express');
var router = express.Router();
var fs = require('fs');
var process = require('child_process');

function rand() {
	return Math.floor(Math.random() * 1000);
}

io.on('connection', function(socket) {
	console.log('user connected');

	socket.on('code', function(content) {
		var fileName = rand() + '_' + Date.now();
		fs.writeFile(fileName + '.py', content, function(err) {
			if(err) console.log(err);

			var program = process.spawn('python', ['-u', '-m', fileName], {
				shell: true,
				detatched: true
			});

			program.stdout.setEncoding('utf8');

			program.stdout.on('data', function(data) {
				console.log(data);
				socket.emit('stdout', data);
			});

			program.stderr.on('data', function(data) {
				console.log(data);
				socket.emit('stderr', data);
			});

			socket.on('stdin', function(data) {
				program.stdin.write(data + '\n');
			});

			program.on('exit', function(code) {
				socket.emit('end', 'Program exited with code ' + code);
				fs.unlink(fileName + '.py');
			});
		});
	});

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

return router;


};