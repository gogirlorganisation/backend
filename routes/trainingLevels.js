/*

Answer format: array, consisting of objects, each comprising a test case.
Testcase consists of input string (stdin) and expected output (stdout).
Every print() statement is followed by a newline (\n).
Every input() to the program is followed by a newline as well.

*/

module.exports = {
	1: [
		{
			stdin: '',
			stdout: '0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181\n'
		}
	],
	2: [
		{
			stdin: 'coding',
			stdout: 'No, it\'s not a palindrome!\n'
		},
		{
			stdin: 'madam',
			stdout: 'Yes, it\'s a palindrome!\n'
		}
	],
	3: [
		{
			stdin: '150',
			stdout: '16'
		}
	],
	4: [
		{
			stdin: '6\n*\n7\n',
			stdout: 'Enter first number:\nOperator:\nEnter second number:\n42\n'
		},
		{
			stdin: '9\n/\n3\n',
			stdout: 'Enter first number:\nOperator:\nEnter second number:\n3.0\n'
		},
		{
			stdin: '41\n+\n9\n',
			stdout: 'Enter first number:\nOperator:\nEnter second number:\n50\n'
		},
		{
			stdin: '900\n-\n5\n',
			stdout: 'Enter first number:\nOperator:\nEnter second number:\n895\n'
		},
	],
	5: [
	    {
	    	stdin: '1',
	    	stdout: 'I'
	    },
	    {
	    	stdin: '2',
	    	stdout: 'II'
	    },
	    {
	    	stdin: '3',
		    stdout: 'III'
		},
    	{
    		stdin: '4',
    		stdout: 'IV'
    	},
	    {
	    	stdin: '5',
	    	stdout: 'V'
	    },
	    {
	    	stdin: '9',
	    	stdout: 'IX'
	    },
	    {
	    	stdin: '12',
	    	stdout: 'XII'
	    },
	    {
	    	stdin: '16',
	    	stdout: 'XVI'
	    },
	    {
	    	stdin: '29',
	    	stdout: 'XXIX'
	    },
	    {
	    	stdin: '44',
	    	stdout: 'XLIV'
	    },
	    {
	    	stdin: '45',
	    	stdout: 'XLV'
	    },
	    {
	    	stdin: '68',
	    	stdout: 'LXVIII'
	    },
	    {
	    	stdin: '83',
	    	stdout: 'LXXXIII'
	    },
	    {
	    	stdin: '97',
	    	stdout: 'XCVII'
	    },
	    {
	    	stdin: '99',
	    	stdout: 'XCIX'
	    },
	    {
	    	stdin: '500',
	    	stdout: 'D'
	    },
	    {
	    	stdin: '501',
	    	stdout: 'DI'
	    },
	    {
	    	stdin: '649',
	    	stdout: 'DCXLIX'
	    },
	    {
	    	stdin: '798',
	    	stdout: 'DCCXCVIII'
	    },
	    {
	    	stdin: '891',
	    	stdout: 'DCCCXCI'
	    },
	    {
	    	stdin: '1000',
	    	stdout: 'M'
	    },
	    {
	    	stdin: '1004',
	    	stdout: 'MIV'
	    },
	    {
	    	stdin: '1006',
	    	stdout: 'MVI'
	    },
	    {
	    	stdin: '1023',
		    stdout: 'MXXIII'
		},
	    {
	    	stdin: '2014',
	    	stdout: 'MMXIV'
	    },
	],
};