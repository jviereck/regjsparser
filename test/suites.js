// The fixture files, with the flags and the parser features that they are
// tested with. Used by test/index.js and test/v8-reference.js.
module.exports = [
  { file: './test-data.json', flags: '' },
  { file: './test-data-lookbehind.json', flags: '', features: {
    lookbehind: true
  } },
  { file: './test-data-unicode.json', flags: 'u' },
  { file: './test-data-unicode-properties.json', flags: 'u', features: {
    unicodePropertyEscape: true
  } },
  { file: './test-data-nonstandard.json', flags: '' },
  { file: './test-data-named-groups.json', flags: '', features: {
    namedGroups: true
  } },
  { file: './test-data-named-groups-unicode.json', flags: 'u', features: {
    namedGroups: true
  } },
  { file: './test-data-named-groups-unicode-properties.json', flags: 'u', features: {
    namedGroups: true,
    unicodePropertyEscape: true
  } },
  { file: './test-data-unicode-set.json', flags: 'v', features: {
    unicodeSet: true,
    unicodePropertyEscape: true
  } },
  { file: './test-data-named-groups-unicode-set.json', flags: 'v', features: {
    namedGroups: true,
    unicodeSet: true
  } },
  { file: './test-data-modifiers-group.json', flags: '', features: {
    modifiers: true,
    namedGroups: true,
  } },
  { file: './test-data-named-groups.json', flags: '', features: {
    modifiers: true,
    namedGroups: true,
  } },
  { file: './test-data-lookbehind-modifiers-group.json', flags: '', features: {
    lookbehind: true,
    modifiers: true,
  } },
];
