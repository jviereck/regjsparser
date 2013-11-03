var fs = require('fs');

var parse = require('../parser').parse;

var parseTests = JSON.parse(fs.readFileSync('test/parse_input.json') || '[]');

var arr = parseTests.map(function(input) {
  var result;
  try {
    result = parse(input);
  } catch (error) {
    result = {
      type: 'error',
      name: error.name,
      message: error.message,
      input: input
    };
  }
  return result;
});
fs.writeFileSync('test/parse_output.json', JSON.stringify(arr, null, 2));