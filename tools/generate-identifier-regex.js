// Based on https://gist.github.com/mathiasbynens/6334847 by @mathias

var regenerate = require('regenerate');

// Which Unicode version should be used?
var version = '11.0.0'; // note: also update `package.json` when this changes

// Shorthand function
var get = function(what) {
  return require('unicode-' + version + '/' + what + '/code-points');
};

// Get the Unicode properties needed to construct the regex.
var ID_Start = get('Binary_Property/ID_Start');
var ID_Continue = get('Binary_Property/ID_Continue');

var generateRegex = function() {
  // https://tc39.github.io/ecma262/#sec-identifier-names-static-semantics-early-errors
  // http://unicode.org/reports/tr31/#Default_Identifier_Syntax
  // https://bugs.ecmascript.org/show_bug.cgi?id=2717#c0
  var identifierStart = regenerate('$', '_')
    // Note: this already includes `Other_ID_Start`. http://git.io/wRCAfQ
    .add(ID_Start)
    .removeRange(0x0, 0x7F); // remove ASCII symbols (regjsparser-specific)
  var identifierPartOnly = regenerate('\u200C', '\u200D')
    // Note: `ID_Continue` already includes `Other_ID_Continue`. http://git.io/wRCAfQ
    .add(ID_Continue)
    .remove(ID_Start)
    .removeRange(0x0, 0x7F); // remove ASCII symbols (regjsparser-specific)
  return {
    'NonAsciiIdentifierStart': identifierStart.toString(),
    'NonAsciiIdentifierPartOnly': identifierPartOnly.toString()
  };
};

var result = generateRegex();
console.log(
  '// ECMAScript (Unicode v%s) NonAsciiIdentifierStart:\n\n%s\n',
  version,
  result.NonAsciiIdentifierStart
);
console.log(
  '// ECMAScript (Unicode v%s) NonAsciiIdentifierPartOnly:\n\n%s',
  version,
  result.NonAsciiIdentifierPartOnly
);
