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

			if(program) {
				program.stdout.on('data', function(data) {
					socket.emit('stdout', data);
				});

				socket.on('stdin', function(data) {
					if(data.indexOf('import') < 0)
						program.stdin.write(data + '\n');
				});
			}

			else {
				socket.emit('end', 'Could not start terminal instance.');
			}
		}
	})
});

return router;


};