import { AstNodeType, parse, RootNode } from "../parser";

let defaultNode: RootNode;
let number: number;
let string: string;
let type: AstNodeType;

defaultNode = parse("", "");
defaultNode = parse("", "", {});
defaultNode = parse("", "", {
  lookbehind: true,
  namedGroups: true,
  unicodeSet: true,
});

// @ts-expect-error
defaultNode.type === "unicodePropertyEscape";

number = defaultNode.range[0];
number = defaultNode.range[1];
string = defaultNode.raw;
type = defaultNode.type;

let nodeWithUnicodePropertyEscape: RootNode<{ unicodePropertyEscape: true }>;
nodeWithUnicodePropertyEscape = parse("", "", {
  unicodePropertyEscape: true,
});

nodeWithUnicodePropertyEscape.type === "unicodePropertyEscape";
