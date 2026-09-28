var jsesc = require('jsesc');

var parse = require('../parser').parse;

var stringify = function(obj) {
  return jsesc(obj, {
    json: true,
    compact: false,
    indent: '  '
  });
};

// When `flags` is null, each key is a regex literal such as `/\A/u`, and the
// pattern and flags are taken from it.
var splitKey = function(key, flags) {
  if (flags !== null) {
    return { pattern: key, flags: flags || '' };
  }
  var index = key.lastIndexOf('/');
  return { pattern: key.slice(1, index), flags: key.slice(index + 1) };
};

var runTests = function(data_path, flags, features) {
  console.log('Testing:', data_path);
  var data = require(data_path)
  Object.keys(data).forEach(function(regex) {
    var results = data[regex];
    var input = splitKey(regex, flags);
    var par;
    try {
      par = parse(input.pattern, input.flags, features);
    } catch (exception) {
      par = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: input.pattern
      };
    }

    if (stringify(par) !== stringify(results)) {
      throw new Error(
        'Failure parsing string ' + input.pattern + (input.flags ? '(' + input.flags + ')' : '') +
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
runTests('./test-data-lookbehind-modifiers-group.json', '', {
  lookbehind: true,
  modifiers: true,
});
runTests('./test-data-buffer-boundaries.json', null, {
  unicodeSet: true,
  bufferBoundaries: true,
  modifiers: true,
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
