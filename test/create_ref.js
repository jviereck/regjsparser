var fs = require('fs');
var jsesc = require('jsesc');

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

  fs.writeFileSync(outputFile, jsesc(arr, {
    json: true, compact: false, indent: '  '
  }));
}

mapInput('test/parse_input.json', 'test/parse_output.json', '');
mapInput('test/parse_unicode_input.json', 'test/parse_unicode_output.json', 'u');

