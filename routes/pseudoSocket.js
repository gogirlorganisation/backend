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
	console.log(type + ': ' + input[i]);
	if(type == 'stdin') {
		cb(input[i++]);
	}
}

this.output = function() {
	return output;
}

};