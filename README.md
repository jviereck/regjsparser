# RegJSParser

Parsing the JavaScript's RegExp in JavaScript.

## Installation

```bash
npm install regjsparser
```

## Usage

```js
var parse = require('regjsparser').parse;

var parseTree = parse('^a'); // /^a/
console.log(parseTree);
/*
  Which prints:
  {
    'type': 'alternative',
    'terms': [
      {
        'type': 'assertion',
        'name': 'start',
        'range': [
          0,
          1
        ],
        'raw': '^'
      },
      {
        'type': 'character',
        'codePoint': 97,
        'range': [
          1,
          2
        ],
        'raw': 'a'
      }
    ],
    'range': [
      0,
      2
    ],
    'raw': '^a',
    'lastMatchIdx': 0
  }
*/
```

## Testing

To run the tests, run the following command:

```bash
npm test
```

To create a new reference file, execute…

```bash
node test/update-fixtures.js
```

…from the repo top directory.
