import { AstNodeType, parse, RootNode } from "../parser";

let defaultNode: RootNode;
let number: number;
let string: string;
let type: AstNodeType;

defaultNode = parse("", "");
defaultNode = parse("", "", {});
defaultNode = parse("", "", {
  lookbehind: true,
  unicodeSet: true,
});

// unicodePropertyEscape = false
// @ts-expect-error
defaultNode.type === "unicodePropertyEscape";

if (defaultNode.type === "reference") {
  // namedGroups = false
  defaultNode.matchIndex;
}

number = defaultNode.range[0];
number = defaultNode.range[1];
string = defaultNode.raw;
type = defaultNode.type;

let nodeWithUnicodePropertyEscape: RootNode<{ unicodePropertyEscape: true }>;
nodeWithUnicodePropertyEscape = parse("", "", {
  unicodePropertyEscape: true,
});

// unicodePropertyEscape = true
nodeWithUnicodePropertyEscape.type === "unicodePropertyEscape";

let nodeWithNamedGroups: RootNode<{ namedGroups: true }>;
nodeWithNamedGroups = parse("", "", {
  namedGroups: true,
});

if (nodeWithNamedGroups.type === "reference") {
  // namedGroups = true
  nodeWithNamedGroups.name;
}
