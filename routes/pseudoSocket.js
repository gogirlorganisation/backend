module.exports = function(stdin) {

var output = {
	stdout: '',
	stderr: ''
}

var input = stdin.split('\n');

var i = 0;

this.emit = function(type, data) {
	output[type] += data;
}

this.on = function(type, cb) {
	if(type == 'stdin') {
		for(var i = 0; i < input.length; i++)
			cb(input[i]);
	}
}

this.output = function() {
	return output;
}

};