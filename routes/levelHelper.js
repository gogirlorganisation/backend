var run = require('./compiler');
var pseudoSocket = require('./pseudoSocket');
var request = require('request');
var levels = require('./answers');
var trainingLevels = require('./trainingLevels');

var rough = function(str) {
	return str.trim().toLowerCase().replace(/[^a-z0-9.]/g, '');
}

var regEscape = function(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

var checkTrainingCorrect = function(level, answer, callback) {
	var returnValues = [];

	if(!trainingLevels[level] || trainingLevels[level].length == 0) {
		callback(true);
		return;
	}

	// filter: remove input prompts for checking
	var inputFiltered = answer;

	inputFiltered = inputFiltered.split('input(');

	for(var i = 1; i < inputFiltered.length; i++) {
		var str = inputFiltered[i];
		str = str.split(')');
		str.shift();
		str = str.join(')');
		str = ')' + str;
		inputFiltered[i] = str;
	}

	inputFiltered = inputFiltered.join('input(');

	answer = inputFiltered;

	for(var i = 0; i < trainingLevels[level].length; i++) {
		// program execution is asynchronus so returnValues[] counts number of functions
		// that have returned, then after the last one is done we run the callback with
		// the required result
		(function(i) {
			var stdin = trainingLevels[level][i].stdin;
			var stdout = trainingLevels[level][i].stdout;

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
				if(returnValues.length === trainingLevels[level].length) {
					var checker = returnValues.indexOf(false) < 0;
					callback(checker);
				}
			});
		})(i);
	}
}

var checkCorrect = function(level, answer, callback) {
	var returnValues = [];

	if(!levels[level]) {
		callback([false]);
		return;
	}

	if(levels[level].type == 'compiler') {
		// if no answers, it's correct
		if(!levels[level].answers || levels[level].answers.length == 0) {
			callback([true]);
			return;
		}

		// filter: remove input prompts for checking
		var inputFiltered = answer;

		inputFiltered = inputFiltered.split('input(');

		for(var i = 1; i < inputFiltered.length; i++) {
			var str = inputFiltered[i];
			str = str.split(')');
			str.shift();
			str = str.join(')');
			str = ')' + str;
			inputFiltered[i] = str;
		}

		inputFiltered = inputFiltered.join('input(');

		answer = inputFiltered;

		for(var i = 0; i < levels[level].answers.length; i++) {
			// program execution is asynchronus so returnValues[] counts number of functions
			// that have returned, then after the last one is done we run the callback with
			// the required result
			(function(i) {
				var stdin = levels[level].answers[i].stdin;
				var stdout = levels[level].answers[i].stdout;

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
					if(returnValues.length === levels[level].answers.length) {
						var checker = returnValues.indexOf(false) < 0;
						callback([checker]);
					}
				});
			})(i);
		}
	}

	else if(levels[level].type == 'cmdline') {
		var correct = levels[level].answers;
		answer = answer.split(',');
		var result = [];
		for(var i = 0; i < correct.length; i++) {
			if(Array.isArray(correct[i])) result[i] = correct[i].indexOf(answer[i].trim()) >= 0;
			else result[i] = correct[i] === answer[i].trim();
			if(result[i] == false) console.log(answer[i].trim(), correct[i]);
		}


		callback(result);
	}

	else {
		callback([false]);
	}
}

/*
Params for sendToAlset:

{
	user: UserObject,
	level: Number,
	answer: String,
	date: Number,
	correct: Boolean
}
*/

var sendToAlset = function(params, res) {
	request.post({
		url: 'https://alset-md.firebaseio.com/thegirlcode.json',
		json: true,
		body: params
	}, function(err, resp, body) {
		if(err) console.error(err);
	});
}

module.exports = {
	checkCorrect: checkCorrect,
	checkTrainingCorrect: checkTrainingCorrect,
	sendToAlset: sendToAlset,
	rough: rough,
	regEscape: regEscape
};