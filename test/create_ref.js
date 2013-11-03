var fs = require('fs');

var parse = require('../parser').parse;

var parseTests = JSON.parse(fs.readFileSync('test/parse_input.json') || '[]');

var arr = parseTests.map(function(string) {
    var res;
    try {
        res = parse(string);
    } catch (e) {
        res = {
            type: 'error',
            name: e.name,
            message: e.message,
            input: string
        };
    }
    return res;
});
fs.writeFileSync('test/parse_output.json', JSON.stringify(arr, null, 2));