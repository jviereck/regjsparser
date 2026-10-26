// Checks every fixture against V8: regjsparser must parse a pattern if and
// only if `new RegExp(pattern, flags)` accepts it, and must reject it with a
// SyntaxError otherwise. Known differences are recorded in
// v8-reference-allowlist.json.
//
// Each fixture is parsed with the flags and features of its suite in
// suites.js, so a pattern can be checked once per feature set. V8 gains RegExp
// features over time, so the allowlist matches the V8 of the Node.js version
// that CI runs this test on (see .github/workflows/ci.yml).

var parse = require('../parser').parse;
var suites = require('./suites');
var allowlist = require('./v8-reference-allowlist.json');

// Parser features that V8 does not support yet. Suites that enable any of them
// are skipped.
var unsupportedFeatures = [
  'bufferBoundaries'
];

// Returns 'ok', or the name of the error thrown, e.g. 'SyntaxError'.
function outcome(callback) {
  try {
    callback();
    return 'ok';
  } catch (exception) {
    return exception.name;
  }
}

// E.g. '/(?<a>x)/u namedGroups,unicodePropertyEscape'.
function key(pattern, flags, features) {
  var enabled = Object.keys(features || {}).filter(function(name) {
    return features[name];
  }).sort();
  return '/' + pattern + '/' + flags + ' ' + enabled.join(',');
}

var allowed = Object.create(null);
allowlist.entries.forEach(function(entry) {
  allowed[key(entry.pattern, entry.flags, entry.features)] = entry;
});

console.log('Testing against V8 ' + process.versions.v8 +
  ' (allowlist recorded with V8 ' + allowlist.v8 + ')');

var seen = Object.create(null);
var unexpected = [];
var allowedCount = 0;
var count = 0;

suites.forEach(function(suite) {
  var features = suite.features || {};
  if (unsupportedFeatures.some(function(name) { return features[name]; })) {
    return;
  }
  var data = require(suite.file);
  Object.keys(data).forEach(function(pattern) {
    var flags = suite.flags;
    var features = suite.features;
    var id = key(pattern, flags, features);
    if (id in seen) {
      return;
    }
    seen[id] = true;
    count++;

    var parserOutcome = outcome(function() {
      parse(pattern, flags, features);
    });
    var v8Outcome = outcome(function() {
      new RegExp(pattern, flags);
    });
    var entry = allowed[id];

    if (parserOutcome === v8Outcome) {
      if (entry) {
        unexpected.push('Allowlisted, but regjsparser and V8 agree now: ' + id);
      }
      return;
    }

    var difference = 'regjsparser: ' + parserOutcome + ', V8: ' + v8Outcome;
    if (!entry) {
      unexpected.push('Not allowlisted: ' + id + ' (' + difference + ')\n' +
        JSON.stringify({
          pattern: pattern,
          flags: flags,
          features: features,
          regjsparser: parserOutcome,
          v8: v8Outcome,
          reason: ''
        }, null, 2));
    } else if (entry.regjsparser !== parserOutcome || entry.v8 !== v8Outcome) {
      unexpected.push('Allowlisted with regjsparser: ' + entry.regjsparser +
        ', V8: ' + entry.v8 + ', but got ' + difference + ': ' + id);
    } else {
      allowedCount++;
    }
  });
});

Object.keys(allowed).forEach(function(id) {
  if (!(id in seen)) {
    unexpected.push('Allowlisted, but not in any fixture: ' + id);
  }
});

if (unexpected.length) {
  throw new Error('V8 reference test failed:\n\n' + unexpected.join('\n\n'));
}

console.log('  PASSED TEST: ' + count + ' patterns checked, ' +
  allowedCount + ' allowlisted differences');
