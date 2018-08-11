module.exports = function(io) {

var express = require('express');
var router = express.Router();
var run = require('./compiler'); 

io.on('connection', function(socket) {
	socket.on('code', function(content) {
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

	});
});

return router;


};