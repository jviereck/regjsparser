// Based on https://gist.github.com/mathiasbynens/6334847 by @mathias

var regenerate = require('regenerate');

// Which Unicode version should be used?
var version = '18.0.0'; // note: also update `package.json` when this changes

// Shorthand function
var get = function(what) {
  return require('@unicode/unicode-' + version + '/' + what + '/code-points.mjs').default;
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

// parser.js creates the regexes from strings on first use, because a regex
// literal of this size would be parsed on every load.
var toStringLiteral = function(regex) {
  return "'" + regex.replace(/\\/g, '\\\\') + "'";
};

var result = generateRegex();
console.log(
  '// ECMAScript (Unicode v%s) NonAsciiIdentifierStart:\n\n%s\n',
  version,
  toStringLiteral(result.NonAsciiIdentifierStart)
);
console.log(
  '// ECMAScript (Unicode v%s) NonAsciiIdentifierPartOnly:\n\n%s',
  version,
  toStringLiteral(result.NonAsciiIdentifierPartOnly)
);
