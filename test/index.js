var fs = require('fs');

var parse = require('../parser').parse;

var parseTests = JSON.parse(fs.readFileSync('test/parse_input.json') || '[]');
var parseResult = JSON.parse(fs.readFileSync('test/parse_output.json') || '[]');

if (parseTests.length !== parseResult.length) {
    fail('Parse input and output file needs to have same number of arguments');
}

parseTests.forEach(function(input, idx) {
    var par;
    try {
        par = parse(input);
    } catch (e) {
        par = {
        type: 'error',
            name: e.name,
            message: e.message,
            input: input
        };
    }

    var res = parseResult[idx];

    if (JSON.stringify(par) !== JSON.stringify(res)) {
        throw new Error('Failure parsing string ' + input + ':' + JSON.stringify(par) + '\n' + JSON.stringify(res));
    } else {
        console.log('PASSED TEST: ' + input);
    }
});