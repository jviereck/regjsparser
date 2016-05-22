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

var updateFixtures = function(fileName, flags, options) {
  var data = {};
  Object.keys(require(fileName)).forEach(function(regex) {
    flags || (flags = '');
    var par;
    try {
      par = parse(regex, flags, options);
    } catch (exception) {
      par = {
        type: 'error',
        name: exception.name,
        message: exception.message,
        input: regex
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
updateFixtures('./test-data-unicode.json', 'u');
updateFixtures('./test-data-unicode-properties.json', 'u', {
  unicodePropertyEscape: true
});
updateFixtures('./test-data-nonstandard.json', '');
