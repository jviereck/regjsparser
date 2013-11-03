var fs = require('fs');

var parse = require('../parser').parse;

var parseTests = JSON.parse(fs.readFileSync('test/parse_input.json') || '[]');

var arr = parseTests.map(parse);
fs.writeFileSync('test/parse_output.json', JSON.stringify(arr, null, 2));