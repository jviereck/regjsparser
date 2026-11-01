// Compares the parser with the published version from the devDependencies.
// Run it with `npm run bench`, which needs a Node.js version that ships the
// experimental node:bench module. The runner options go before the file, e.g.
//
//   node --experimental-bench --bench --bench-name-pattern=emoji tools/bench/index.mjs
import { bench } from "node:bench";
import { performance } from "node:perf_hooks";

import * as parserCurrent from "../../parser.js";
import * as parserBaseline from "regjsparser";
import { samples } from "./samples.mjs";

const parsers = {
  baseline: parserBaseline.default.parse,
  current: parserCurrent.default.parse,
};

const options = {
  modifiers: true,
  unicodeSet: true,
  unicodePropertyEscape: true,
  namedGroups: true,
  lookbehind: true,
};

// The approximate duration of a sample, and the number of samples that warm up
// a benchmark before it is measured.
const sampleTimeMs = 20;
const warmup = 5;

for (const [title, sample] of Object.entries(samples)) {
  const regex = sample.slice(1, sample.lastIndexOf("/"));
  const flags = sample.slice(sample.lastIndexOf("/") + 1);

  for (const [name, parse] of Object.entries(parsers)) {
    let operations = 0;

    bench(`${title} ${name}`, { warmup }, (t) => {
      t.start();
      if (t.phase === "warmup") {
        // Count how many parses fill a sample, so that the measured samples
        // don't need to read the clock between the parses.
        const end = performance.now() + sampleTimeMs;
        operations = 0;
        do {
          parse(regex, flags, options);
          operations++;
        } while (performance.now() < end);
      } else {
        for (let i = 0; i < operations; i++) {
          parse(regex, flags, options);
        }
      }
      t.end(operations);
    });
  }
}
