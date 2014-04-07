var fs = require('fs');

var parse = require('../parser').parse;

function mapInput(inputFile, outputFile, flags) {
  var parseTests = JSON.parse(fs.readFileSync(inputFile) || '[]');

  var arr = parseTests.map(function(input) {
    var result;
    try {
      result = parse(input, flags);
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
  fs.writeFileSync(outputFile, JSON.stringify(arr, null, 2));
}

mapInput('test/parse_input.json', 'test/parse_output.json', '');
mapInput('test/parse_unicode_input.json', 'test/parse_unicode_output.json', 'u');

