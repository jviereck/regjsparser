var fs = require('fs');
var jsesc = require('jsesc');

var parse = require('../parser').parse;

var stringify = function(obj) {
  return jsesc(obj, {
    json: true,
    compact: false,
    indent: '  '
  });
};

var runTests = function(data, flags, features) {
  Object.keys(data).forEach(function(regex) {
    var results = data[regex];
    flags || (flags = '');
    var par;
    try {
      par = parse(regex, flags, features);
    } catch (exception) {
      par = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: regex
      };
    }

    if (stringify(par) !== stringify(results)) {
      throw new Error(
        'Failure parsing string ' + regex + (flags ? '(' + flags + ')' : '') +
        ':' + JSON.stringify(par) + '\n' + JSON.stringify(results)
      );
    } else {
      console.log('PASSED TEST: ' + regex);
    }
  });
};

runTests(require('./test-data.json'), '');
runTests(require('./test-data-unicode.json'), 'u');
runTests(require('./test-data-unicode-properties.json'), 'u', {
  unicodePropertyEscape: true
});
runTests(require('./test-data-nonstandard.json'), '');
runTests(require('./test-data-named-groups.json'), '', {
  namedGroups: true
});
runTests(require('./test-data-named-groups-unicode.json'), 'u', {
  namedGroups: true
});
runTests(require('./test-data-named-groups-unicode-properties.json'), 'u', {
  namedGroups: true,
  unicodePropertyEscape: true
});
