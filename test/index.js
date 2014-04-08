var fs = require('fs');
var jsesc = require('jsesc');

var parse = require('../parser').parse;

var parseTests = [].concat(
  JSON.parse(fs.readFileSync('test/parse_input.json') || '[]').map(function(re){ return {input: re, flags: ''} }),
  JSON.parse(fs.readFileSync('test/parse_unicode_input.json', 'utf8') || '[]').map(function(re){ return {input: re, flags: 'u'} })
);
var parseResult = [].concat(
  JSON.parse(fs.readFileSync('test/parse_output.json') || '[]'),
  JSON.parse(fs.readFileSync('test/parse_unicode_output.json', 'utf8') || '[]')
);

if (parseTests.length !== parseResult.length) {
  fail('Parse input and output file needs to have same number of arguments');
}

parseTests.forEach(function(re, idx) {
  var input = re.input;
  var flags = re.flags;
  var par;
  try {
    par = parse(input, flags);
  } catch (error) {
    par = {
      type: 'error',
      name: error.name,
      message: error.message,
      input: input
    };
  }

  var resuls = parseResult[idx];

  var stringify = function(obj) {
    return jsesc(obj, {
      json: true, compact: false, indent: '  '
    });
  }

  if (stringify(par) !== stringify(resuls)) {
    throw new Error('Failure parsing string ' + input + (flags ? '(' + flags + ')' : '') + ':' + JSON.stringify(par) + '\n' + JSON.stringify(resuls));
  } else {
    console.log('PASSED TEST: ' + input);
  }
});