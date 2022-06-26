import { AstNodeType, Identifier, ModifierFlags, parse, RootNode } from "../parser";

function assert<T>(input: T): void {}

let defaultNode: RootNode;

defaultNode = parse("", "");
defaultNode = parse("", "", {});
defaultNode = parse("", "", {
  lookbehind: true,
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
  assert<number>(defaultNode.matchIndex);
}

if (defaultNode.type === "characterClass") {
  defaultNode.kind === "union";
  assert<"union">(defaultNode.kind);
}

assert<number>(defaultNode.range[0]);
assert<number>(defaultNode.range[1]);
assert<string>(defaultNode.raw);
assert<AstNodeType>(defaultNode.type);

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
  assert<Identifier>(nodeWithNamedGroups.name);
}

let nodeWithMaybeNamedGroups = parse("", "", {
  namedGroups: false as boolean,
});

if (nodeWithMaybeNamedGroups.type === "reference") {
  assert<number | undefined>(nodeWithMaybeNamedGroups.matchIndex);
  assert<Identifier | undefined>(nodeWithMaybeNamedGroups.name);
}

if (
  nodeWithMaybeNamedGroups.type === "group" &&
  nodeWithMaybeNamedGroups.behavior === "normal"
) {
  assert<Identifier | undefined>(nodeWithMaybeNamedGroups.name);
}

let nodeWithUnicodeSet: RootNode<{ unicodeSet: true }>;
nodeWithUnicodeSet = parse("", "", {
  unicodeSet: true,
});

if (nodeWithUnicodeSet.type === "characterClass") {
  nodeWithUnicodeSet.kind === "union";
  nodeWithUnicodeSet.kind === "intersection";
  nodeWithUnicodeSet.kind === "subtraction";
  assert<"union" | "intersection" | "subtraction">(nodeWithUnicodeSet.kind);
}

let nodeWithModifiers: RootNode<{ modifiers: true }>;
nodeWithModifiers = parse("", "", {
  modifiers: true,
});

if (
  nodeWithModifiers.type === "group" &&
  nodeWithModifiers.behavior === "ignore"
) {
  assert<ModifierFlags | undefined>(nodeWithModifiers.modifierFlags);
}
