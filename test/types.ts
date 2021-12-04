import { AstNodeType, parse, RootNode } from "../parser";

let node: RootNode;
let number: number;
let string: string;
let type: AstNodeType;

node = parse("", "");
node = parse("", "", {});
node = parse("", "", {
  lookbehind: true,
  namedGroups: true,
  unicodePropertyEscape: true,
});

number = node.range[0];
number = node.range[1];
string = node.raw;
type = node.type;
