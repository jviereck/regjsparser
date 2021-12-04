export type AstNodeType =
  | "alternative"
  | "anchor"
  | "characterClass"
  | "characterClassEscape"
  | "characterClassRange"
  | "disjunction"
  | "dot"
  | "group"
  | "quantifier"
  | "reference"
  | "unicodePropertyEscape"
  | "value";

export type Base<T extends AstNodeType> = {
  range: [number, number];
  raw: string;
  type: T;
};

/* eslint-disable no-use-before-define */
export type AstNode =
  | Alternative
  | Anchor
  | CharacterClass
  | CharacterClassEscape
  | CharacterClassRange
  | Disjunction
  | Dot
  | Group
  | Quantifier
  | Reference
  | UnicodePropertyEscape
  | Value;

export type RootNode = Exclude<AstNode, CharacterClassRange>;
/* eslint-enable no-use-before-define */

export type Anchor = Base<"anchor"> & {
  kind: "boundary" | "end" | "not-boundary" | "start";
};

export type CharacterClassEscape = Base<"characterClassEscape"> & {
  value: string;
};

export type Value = Base<"value"> & {
  codePoint: number;
  kind:
    | "controlLetter"
    | "hexadecimalEscape"
    | "identifier"
    | "null"
    | "octal"
    | "singleEscape"
    | "symbol"
    | "unicodeCodePointEscape"
    | "unicodeEscape";
};

export type Alternative = Base<"alternative"> & {
  body: RootNode[];
};

export type CharacterClassRange = Base<"characterClassRange"> & {
  max: Value;
  min: Value;
};

export type UnicodePropertyEscape = Base<"unicodePropertyEscape"> & {
  negative: boolean;
  value: string;
};

export type CharacterClassBody =
  | CharacterClassEscape
  | CharacterClassRange
  | UnicodePropertyEscape
  | Value;
export type CharacterClass = Base<"characterClass"> & {
  body: CharacterClassBody[];
  negative: boolean;
};

export type NonCapturingGroup = Base<"group"> & {
  behavior:
    | "ignore"
    | "lookahead"
    | "lookbehind"
    | "negativeLookahead"
    | "negativeLookbehind";
  body: RootNode[];
};

export type CapturingGroup = Base<"group"> & {
  behavior: "normal";
  body: RootNode[];
  name?: string;
};

export type Group = CapturingGroup | NonCapturingGroup;

export type Quantifier = Base<"quantifier"> & {
  body: [RootNode];
  greedy: boolean;
  max?: number;
  min: number;
};

export type Disjunction = Base<"disjunction"> & {
  body: [RootNode, RootNode, ...RootNode[]];
};

export type Dot = Base<"dot">;

export type Reference = Base<"reference"> &
  (
    | {
        matchIndex: number;
        name?: undefined;
      }
    | {
        matchIndex?: undefined;
        name: string;
      }
  );

export type Features = {
  lookbehind?: boolean;
  namedGroups?: boolean;
  unicodePropertyEscape?: boolean;
};

export function parse(
  str: string,
  flags: string,
  features?: Features
): RootNode;
