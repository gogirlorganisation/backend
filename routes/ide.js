module.exports = function(io) {

var express = require('express');
var router = express.Router();
var run = require('./compiler');
var cmd = require('./cmdline');

io.on('connection', function(socket) {
	var socketBeingUsed = false;

	socket.on('code', function(content) {
		if(!socketBeingUsed) {
			socketBeingUsed = true;

			var program = run(content, socket);

			program.stdout.on('data', function(data) {
				socket.emit('stdout', data);
			});

			program.stderr.on('data', function(data) {
				socket.emit('stderr', data);
			});

			socket.on('stdin', function(data) {
				program.stdin.write(data + '\n');
			});
		}
	});

	socket.on('cmdline', function(prefile) {
		if(!socketBeingUsed) {
			socketBeingUsed = true;

			var program = cmd(socket, prefile);

			program.stdout.on('data', function(data) {
				socket.emit('stdout', data);
			});

			socket.on('stdin', function(data) {
				if(data.indexOf('import') < 0)
					program.stdin.write(data + '\n');
			});
		}
	})
});

return router;


};