import { Bench } from "tinybench";

import * as parserCurrent from "../../parser.js";
import * as parserBaseline from "regjsparser";
import { samples } from "./samples.mjs";

const parseCurrent = parserCurrent.default.parse;
const parseBaseline = parserBaseline.default.parse;

const parse = process.argv[2] === "current" ? parseCurrent : parseBaseline;
const bench = new Bench({ name: "benchmark between baseline and current", time: 500 });

for (const [title, sample] of Object.entries(samples)) {
  const regex = sample.slice(1, sample.lastIndexOf("/"));
  const flags = sample.slice(sample.lastIndexOf("/"));

  bench.add("parse " + process.argv[2] + " " + title, () => {
    parse(regex, flags, {
      modifiers: true,
      unicodeSet: true,
      unicodePropertyEscape: true,
      namedGroups: true,
      lookbehind: true,
    });
  });
}

await bench.run();

console.table(bench.table());
