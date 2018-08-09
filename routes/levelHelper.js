var run = require('./compiler');
var pseudoSocket = require('./pseudoSocket');

var rough = function(str) {
	return str.trim().toLowerCase().replace(/[^a-z0-9.]/g, '');
}

var regEscape = function(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

var checkCorrect = function(answers, level, answer, callback) {
	var returnValues = [];

	if(!answers[level] || answers[level].length == 0) {
		callback(false);
		return;
	}

	for(var i = 0; i < answers[level].length; i++) {
		// program execution is asynchronus so returnValues[] counts number of functions
		// that have returned, then after the last one is done we run the callback with
		// the required result
		(function(i) {
			var stdin = answers[level][i].stdin;
			var stdout = answers[level][i].stdout;

			var socket = new pseudoSocket(stdin);

			var program = run(answer, socket);

			program.stdout.on('data', function(data) {
				socket.emit('stdout', data);
			});

			program.stderr.on('data', function(data) {
				socket.emit('stderr', data);
			});

			socket.on('stdin', function(data) {
				program.stdin.write(data + '\n');
			});

			program.on('exit', function() {
				var received = socket.output().stdout;
				returnValues[returnValues.length] = (rough(received) === rough(stdout));
				if(returnValues.length === answers[level].length) {
					var checker = returnValues.indexOf(false) < 0;
					callback(checker);
				}
			});
		})(i);
	}
}

module.exports = {
	checkCorrect: checkCorrect,
	rough: rough,
	regEscape: regEscape
};