import { AstNodeType, parse, RootNode } from "../parser";

let defaultNode: RootNode;
let number: number;
let string: string;
let boolean: boolean = false as boolean;
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

if (defaultNode.type === "group" && defaultNode.behavior === "normal") {
  // namedGroups = false
  // @ts-expect-error
  nodeWithNamedGroups.name;
}

if (defaultNode.type === "reference") {
  // namedGroups = false
  defaultNode.matchIndex;

  // @ts-expect-error
  nodeWithMaybeNamedGroups.referenceType === "named";
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

if (
  nodeWithNamedGroups.type === "group" &&
  nodeWithNamedGroups.behavior === "normal"
) {
  // namedGroups = true
  nodeWithNamedGroups.name;
}

if (nodeWithNamedGroups.type === "reference") {
  // namedGroups = true
  nodeWithNamedGroups.name;
  // @ts-expect-error
  nodeWithMaybeNamedGroups.referenceType === "index";
}

let nodeWithMaybeNamedGroups = parse("", "", {
  namedGroups: boolean,
});

if (nodeWithMaybeNamedGroups.type === "reference") {
  if (nodeWithMaybeNamedGroups.referenceType === "index") {
    nodeWithMaybeNamedGroups.matchIndex;
  } else if (nodeWithMaybeNamedGroups.referenceType === "named") {
    nodeWithMaybeNamedGroups.name;
  }
}
