var jsesc = require('jsesc');

var parse = require('../parser').parse;
var suites = require('./suites');

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

suites.forEach(function(suite) {
  runTests(suite.file, suite.flags, suite.features);
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

(function testLargeClassContents() {
  var message = "It should correctly parse large character class contents.";

  parse("[" + Array(8192).fill("a").join("") + "]", "");
  console.log("  PASSED TEST: " + message);
})();

(function testReentrancy() {
  var message = "It should be reentrant.";

  function check(actual, expected) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message + '\nExpected:\n' + JSON.stringify(expected) + '\nActual:\n' + JSON.stringify(actual));
    }
  }

  // A nested parse() call from input.toString().
  check(parse({ toString: function() { parse('a'); return 'b'; } }), parse('b'));

  // A nested parse() call that throws.
  check(parse({ toString: function() {
    try { parse('('); } catch (e) { /* ignore */ }
    return 'b';
  } }), parse('b'));

  // A nested parse() call from a getter on the options, i.e. while parsing.
  check(parse('(?<=x)y', '', {
    get lookbehind() { parse('[a-z]{2}', 'u'); return true; }
  }), parse('(?<=x)y', '', { lookbehind: true }));

  // A nested parse() call must not clobber the group names of the outer call.
  ['(?<a>x)\\k<a>', '(?<a>x)(?<b>y)', '\\k<a>(?<a>x)'].forEach(function(pattern) {
    check(parse(pattern, '', {
      get namedGroups() { parse('(?<b>y)|(?<b>z)', '', { namedGroups: true }); return true; }
    }), parse(pattern, '', { namedGroups: true }));
  });

  console.log("  PASSED TEST: " + message);
})();
