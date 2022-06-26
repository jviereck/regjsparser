var jsesc = require('jsesc');

var parse = require('../parser').parse;

var stringify = function(obj) {
  return jsesc(obj, {
    json: true,
    compact: false,
    indent: '  '
  });
};

var runTests = function(data_path, flags, features) {
  console.log('Testing:', data_path);
  var data = require(data_path)
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
      console.log('  PASSED TEST: ' + regex);
    }
  });
};

runTests('./test-data.json', '');
runTests('./test-data-lookbehind.json', '', {
  lookbehind: true
});
runTests('./test-data-unicode.json', 'u');
runTests('./test-data-unicode-properties.json', 'u', {
  unicodePropertyEscape: true
});
runTests('./test-data-nonstandard.json', '');
runTests('./test-data-named-groups.json', '', {
  namedGroups: true
});
runTests('./test-data-named-groups-unicode.json', 'u', {
  namedGroups: true
});
runTests('./test-data-named-groups-unicode-properties.json', 'u', {
  namedGroups: true,
  unicodePropertyEscape: true
});
runTests('./test-data-unicode-set.json', 'v', {
  unicodeSet: true,
  unicodePropertyEscape: true
});
runTests('./test-data-modifiers-group.json', '', {
  modifiers: true,
  namedGroups: true,
});
runTests('./test-data-named-groups.json', '', {
  modifiers: true,
  namedGroups: true,
});


(function testUVError() {
  var message = 'It should throw an error when using both the "u" and "v" flags.';

  try {
    parse('(?:)', 'uv', { unicodeSet: true });
  } catch (e) {
    console.log('  PASSED TEST: ' + message);
    return;
  }

  throw new Error(message);
})();
