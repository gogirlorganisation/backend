/*

compiler answer format: array, consisting of objects, each comprising a test case.
Testcase consists of input string (stdin) and expected output (stdout).
Every print() statement is followed by a newline (\n).
Every input() to the program is followed by a newline as well.

cmdline answer format: 
	array of:
		- strings, answers[i] is the answer to textbox q_i_.
		- array of strings, each string in answers[i] is a correct answer to q_i_.

*/

module.exports = {
	0: {
		type: 'cmdline',
		answers: []
	},
	1: {
		type: 'cmdline',
		answers: ['8', '42', '1.75', '8.0', '9', '4.0', '1']
	},
	2: {
		type: 'cmdline',
		answers: ['45']
	},
	3: {
		type: 'cmdline',
		answers: ['int', 'float', 'int', 'float', 'int', 'int']
	},
	4: {
		type: 'cmdline',
		answers: [['6747.0', '6747']],
	},
	5: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: '7\nHello World!'
			}
		],
	},
	6: {
		type: 'cmdline',
		answers: [],
	},
	7: {
		type: 'compiler',
		defaultValue: 
'# this is a comment, everything in this line is ignored after the hash sign (#).\n\
\n\
bolts = 10\n\
screws = 2000.0\n\
heatSinks = 15\n\
thisIsASentence = "hello world"\n\
\n\
# Write code below this line:\n',
		answers: [
			{
				stdin: '',
				stdout: '<class \'int\'>\n<class \'float\'>\n<class \'int\'><class \'str\'>'
			}
		],
	},
	8: {
		type: 'cmdline',
		answers: [
			['HelloHelloHello', '\'HelloHelloHello\'', '"HelloHelloHello"'],
			['HelloWorld!HelloWorld!', '\'HelloWorld!HelloWorld!\'', '\"HelloWorld!HelloWorld!\"'],
			['lol', "'lol'", '"lol"'],
			['4 / 2', "'4 / 2'", '"4 / 2"'],
			['Truth is always best', '\'Truth is always best\'', '\"Truth is always best\"'],
			['Truth is best', "'Truth is best'", '"Truth is best"'],
			['Truth is best', "'Truth is best'", '"Truth is best"']
		],
	},
	9: {
		type: 'cmdline',
		answers: [],
	},
	10: {
		type: 'compiler',
		answers: [
			{
				stdin: 'ada@aeproject.co',
				stdout: 'ada'
			},
			{
				stdin: 'japnit@aeproject.co',
				stdout: 'japnit'
			},
			{
				stdin: 'webmaster@aeproject.co',
				stdout: 'webmaster'
			}
		],
	},
	11: {
		type: 'cmdline',
		answers: [],
	},
	12: {
		type: 'cmdline',
		answers: []
	},
	13: {
		type: 'compiler',
		answers: [
			{
				stdin: '\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get no phone. :/'
			},
			{
				stdin: 'Google\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get a Google Pixel'
			},
			{
				stdin: 'Samsung\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get a Galaxy S8'
			},
			{
				stdin: 'Apple',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get an iPhone'
			}
		]
	},
	14: {
		type: 'compiler',
		answers: [
			{
				stdin: '352500\n11\n',
				stdout: '5'
			},
			{
				stdin: '2965000\n42\n',
				stdout: '42'
			},
			{
				stdin: '4864500\n30\n',
				stdout: '30'
			}
		],
		defaultValue:
'surplusMoney = int(input())\n\
emptyDesks = int(input())\n\
salaryOfProgrammer = 70500\n\n\n\
#write code from here:\n\n\n'
	},
	15: {
		type: 'compiler',
		answers: [],
	},
	16: {
		type: 'compiler',
		defaultValue:
'#edit code from here:\n\
def multiply(a,b):\n\
  return(a*b)\n\
\n\
def divide():\n\
\n\
def remainder():\n\
\n\
def addition():\n\
\n\
def subtraction():\n\
\n\n\n\n\
#don’t edit code below this\n\
num1 = int(input())\n\
num2 = int(input())\n\
print(multiply(num1, num2))\n\
print(divide(num1, num2))\n\
print(remainder(num1, num2))\n\
print(addition(num1, num2))\n\
print(subtraction(num1, num2))',
		answers: [
			{
				stdin: '30\n20\n',
				stdout: '600\n1.5\n10\n50\n10'
			},
			{
				stdin: '5000\n20\n',
				stdout: '100000\n250.0\n0\n5020\n4980'
			}
		],
	},
	17: {
		type: 'cmdline',
		answers: []
	},
	18: {
		type: 'cmdline',
		answers: []
	}
};
