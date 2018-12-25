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

			content = content.replace(/\s*import/g, ' # import');
			content = content.replace(/\nfrom/g, '\n# from');

			var program = run(content, socket);

			if(program) {
				program.stdout.on('data', function(data) {
					socket.emit('stdout', data);
				});

				program.stderr.on('data', function(data) {
					socket.emit('stderr', data);
				});

				socket.on('stdin', function(data) {
					program.stdin.write(data + '\n');
				});

				socket.on('disconnect', function() {
					program.kill('SIGKILL');
				});
			}

			else {
				socket.emit('end', 'Could not start program instance.');
			}
		}
	});

	socket.on('cmdline', function(prefile) {
		if(!socketBeingUsed) {
			socketBeingUsed = true;

			var program = cmd(socket, prefile);

			var stdin = function(data) {
				if(data.indexOf('import') < 0)
					program.stdin.write(data + '\n');
			};

			var disconnect = function() {
				program.kill('SIGKILL');
				socketBeingUsed = false;
			};

			if(program) {
				program.stdout.on('data', function(data) {
					socket.emit('stdout', data);
				});

				socket.on('stdin', stdin);

				socket.on('disconnect', disconnect);

				program.on('exit', function(code) {
					socketBeingUsed = false;
					socket.removeListener('stdin', stdin);
					socket.removeListener('disconnect', disconnect);
					socket.emit('end', 'Program exited with code ' + code);
				});
			}

			else {
				socketBeingUsed = false;
				socket.emit('end', 'Could not start terminal instance.');
			}
		}
	})
});

return router;


};