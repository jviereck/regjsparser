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

// When `flags` is null, each key is a regex literal such as `/\A/u`, and the
// pattern and flags are taken from it.
var splitKey = function(key, flags) {
  if (flags !== null) {
    return { pattern: key, flags: flags || '' };
  }
  var index = key.lastIndexOf('/');
  return { pattern: key.slice(1, index), flags: key.slice(index + 1) };
};

var updateFixtures = function(fileName, flags, options) {
  var data = {};
  Object.keys(require(fileName)).forEach(function(regex) {
    var input = splitKey(regex, flags);
    var par;
    try {
      par = parse(input.pattern, input.flags, options);
    } catch (exception) {
      par = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: input.pattern
      };
    }
    data[regex] = par;
  });
  fs.writeFileSync(
    __dirname + '/' + fileName,
    stringify(data) + '\n'
  );
};

updateFixtures('./test-data.json', '');
updateFixtures('./test-data-lookbehind.json', '', {
  lookbehind: true
});
updateFixtures('./test-data-unicode.json', 'u');
updateFixtures('./test-data-unicode-properties.json', 'u', {
  unicodePropertyEscape: true
});
updateFixtures('./test-data-nonstandard.json', '');
updateFixtures('./test-data-named-groups.json', '', {
  namedGroups: true
});
updateFixtures('./test-data-named-groups-unicode.json', 'u', {
  namedGroups: true
});
updateFixtures('./test-data-named-groups-unicode-properties.json', 'u', {
  namedGroups: true,
  unicodePropertyEscape: true
});
updateFixtures('./test-data-unicode-set.json', 'v', {
  unicodeSet: true,
  unicodePropertyEscape: true
});
updateFixtures('./test-data-modifiers-group.json', '', {
  modifiers: true,
});
updateFixtures('./test-data-lookbehind-modifiers-group.json', '', {
  lookbehind: true,
  modifiers: true,
});
updateFixtures('./test-data-buffer-boundaries.json', null, {
  unicodeSet: true,
  bufferBoundaries: true,
  modifiers: true,
});
