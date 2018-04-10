module.exports = function(io) {

var express = require('express');
var router = express.Router();
var compiler = require('./compiler'); 

io.on('connection', function(socket) {
	console.log('user connected');

	socket.on('code', function(content) {
		var program = compiler(content, socket);

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

	});

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
});

return router;


};