// Checks the V8 hidden classes (maps) of the AST nodes:
//
// - All nodes of a type with the same keys share one map. A property that is
//   added after a node is created would give the node a second map.
// - No parse, not even one that throws, changes a small integer field such as
//   `codePoint` or `min` to a double field. V8 would then deprecate the map,
//   and every later node of that type would store the field in a separate
//   heap number.
//
// A valid quantifier bound above 2^30 - 1, such as `a{2000000000}`, does change
// `min` to a double field, which is rare and cheap. Don't add such a pattern
// to the fixtures, or this test fails.
//
// Run: node test/hidden-classes.js

var v8 = require('v8');
v8.setFlagsFromString('--allow-natives-syntax');
// Created with the Function constructor so that the natives syntax is parsed
// after the flag is set, and not by the linter.
var haveSameMap = new Function('a', 'b', 'return %HaveSameMap(a, b);');
var isSmi = new Function('a', 'return %IsSmi(a);');
var hasFastProperties = new Function('a', 'return %HasFastProperties(a);');

var parse = require('../parser').parse;
var suites = require('./suites');

var allFeatures = {
  lookbehind: true,
  modifiers: true,
  namedGroups: true,
  unicodePropertyEscape: true,
  unicodeSet: true
};

// Patterns that create every node type, with only small integers in the
// number fields.
var referencePatterns = [
  ['^(?<n>a|b\\u{1F600}\\uD83D\\uDE00[a-z\\d\\cA\\x41]*?)\\k<n>\\1.(?i:x){2,3}(?<=y)(?!z)\\p{L}\\0\\b$', 'u'],
  ['(a)\\1\\8\\u0041\\t\\-\\08+?[^\\b-]', ''],
  ['[\\q{ab|c}--[a-z]][\\p{L}&&[a-z]]', 'v']
];

// Inputs that once stored a NaN or a number above 2^30 - 1 in a node.
var badInputs = [
  ['\\', ''],
  ['a\\', ''],
  ['[\\', ''],
  ['\\u{ffffffffff}', 'u'],
  ['[\\u{ffffffffff}]', 'u'],
  ['(?<\\u{ffffffffffffffff}>)', 'u'],
  ['(?<\\u{ffffffffffffffff}>)', ''],
  ['x{9999999999999999999}', ''],
  ['x{9999999999999999999,}', ''],
  ['x{0,9999999999999999999}', ''],
  ['x{9999999999999999999,9999999999999999999}', '']
];

// The first node seen for each type and key set, by "type:key,key,...".
var representatives = Object.create(null);

function shapeKey(node) {
  return node.type + ':' + Object.keys(node).join(',');
}

function forEachNode(value, callback) {
  if (Array.isArray(value)) {
    value.forEach(function(item) {
      forEachNode(item, callback);
    });
  } else if (value && typeof value === 'object' && typeof value.type === 'string') {
    callback(value);
    Object.keys(value).forEach(function(key) {
      if (key !== 'range') {
        forEachNode(value[key], callback);
      }
    });
  }
}

// Returns a copy of `node` made by an object literal with the same keys. V8
// gives object literals with the same keys in the same order one map, which
// holds all the properties in the object.
function copyByLiteral(node) {
  var body = Object.keys(node).map(function(key) {
    return JSON.stringify(key) + ': node[' + JSON.stringify(key) + ']';
  });
  return new Function('node', 'return {' + body.join(', ') + '};')(node);
}

// Checks that each node has the map of the first node with its type and keys,
// and that this is the map of an object literal with these keys.
function checkMaps(ast, input) {
  forEachNode(ast, function(node) {
    var key = shapeKey(node);
    if (!hasFastProperties(node)) {
      throw new Error('A ' + key + ' node of ' + input + ' has dictionary properties.');
    }
    if (!(key in representatives)) {
      if (!haveSameMap(copyByLiteral(node), node)) {
        throw new Error(
          'A ' + key + ' node of ' + input + ' has a different hidden class ' +
          'than an object literal with its keys. Was a property added after ' +
          'the node was created?'
        );
      }
      representatives[key] = node;
    } else if (!haveSameMap(representatives[key], node)) {
      throw new Error(
        'A ' + key + ' node of ' + input + ' has a different hidden class than ' +
        'the first one. A property was added after the node was created, or a ' +
        'parse before this one stored a number that is not a small integer.'
      );
    }
  });
}

function checkSmis(ast, input) {
  forEachNode(ast, function(node) {
    Object.keys(node).forEach(function(key) {
      if (typeof node[key] === 'number' && !isSmi(node[key])) {
        throw new Error(
          'The ' + key + ' field of a ' + node.type + ' node of ' + input +
          ' holds ' + node[key] + ' as a heap number: the field was changed ' +
          'to a double field.'
        );
      }
    });
  });
}

function tryParse(pattern, flags, features) {
  try {
    return parse(pattern, flags, features);
  } catch (e) {
    return null;
  }
}

function describe(pattern, flags) {
  return JSON.stringify(pattern) + (flags ? ' (' + flags + ')' : '');
}

// The reference patterns go first, so their nodes have the maps that all later
// nodes must have.
referencePatterns.forEach(function(input) {
  var ast = parse(input[0], input[1], allFeatures);
  checkMaps(ast, describe(input[0], input[1]));
  checkSmis(ast, describe(input[0], input[1]));
});

var types = Object.create(null);
Object.keys(representatives).forEach(function(key) {
  types[key.slice(0, key.indexOf(':'))] = true;
});
[
  'alternative', 'anchor', 'characterClass', 'characterClassEscape',
  'characterClassRange', 'classString', 'classStrings', 'disjunction', 'dot',
  'group', 'identifier', 'quantifier', 'reference', 'unicodePropertyEscape',
  'value'
].forEach(function(type) {
  if (!types[type]) {
    throw new Error('The reference patterns create no ' + type + ' node.');
  }
});

badInputs.forEach(function(input) {
  tryParse(input[0], input[1], allFeatures);
  tryParse(input[0], input[1], {});
});

suites.forEach(function(suite) {
  var data = require(suite.file);
  Object.keys(data).forEach(function(key) {
    var pattern = key, flags = suite.flags || '';
    if (suite.flags === null) {
      var index = key.lastIndexOf('/');
      pattern = key.slice(1, index);
      flags = key.slice(index + 1);
    }
    checkMaps(tryParse(pattern, flags, suite.features), describe(pattern, flags));
    checkMaps(tryParse(pattern, flags, allFeatures), describe(pattern, flags));
  });
});

// Parse the reference patterns again, after all the other inputs.
// `representatives` keeps the first nodes alive, so a map that V8 deprecated
// in the meantime still differs from the map of the new nodes.
referencePatterns.forEach(function(input) {
  var ast = parse(input[0], input[1], allFeatures);
  checkMaps(ast, describe(input[0], input[1]));
  checkSmis(ast, describe(input[0], input[1]));
});

console.log('  PASSED TEST: Each node type has one hidden class per key set (' +
  Object.keys(representatives).length + ' in all), and number fields stay small integers.');
