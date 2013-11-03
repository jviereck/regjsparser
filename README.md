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
    "type": "alternative",
    "terms": [
      {
        "type": "assertion",
        "sub": "start",
        "from": 0,
        "to": 1,
        "raw": "^"
      },
      {
        "type": "character",
        "char": "a",
        "from": 1,
        "to": 2,
        "raw": "a"
      }
    ],
    "from": 0,
    "to": 2,
    "raw": "^a",
    "lastMatchIdx": 0
  }
*/
```

## Testing

Run the command

```bash
npm test
```

To create a new reference file, execute

```bash
node test/create_ref.js
```

from the repo top directory.
