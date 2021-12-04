type _If<Test, Then, Else = {}> = Test extends true ? Then : Else;

export type Features = {
  lookbehind?: boolean;
  namedGroups?: boolean;
  unicodePropertyEscape?: boolean;
  unicodeSet?: boolean;
};

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

export type RootNode<F extends Features = {}> =
  | Exclude<AstNode, CharacterClassRange | UnicodePropertyEscape>
  | _If<F["unicodePropertyEscape"], UnicodePropertyEscape, never>;

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

export type Alternative<F extends Features = {}> = Base<"alternative"> & {
  body: RootNode<F>[];
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

export type NonCapturingGroup<F extends Features = {}> = Base<"group"> & {
  behavior:
    | "ignore"
    | "lookahead"
    | "lookbehind"
    | "negativeLookahead"
    | "negativeLookbehind";
  body: RootNode<F>[];
};

export type CapturingGroup<F extends Features = {}> = Base<"group"> & {
  behavior: "normal";
  body: RootNode<F>[];
  name?: string;
};

export type Group = CapturingGroup | NonCapturingGroup;

export type Quantifier<F extends Features = {}> = Base<"quantifier"> & {
  body: [RootNode<F>];
  greedy: boolean;
  max?: number;
  min: number;
};

export type Disjunction<F extends Features = {}> = Base<"disjunction"> & {
  body: [RootNode<F>, RootNode<F>, ...RootNode<F>[]];
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

export function parse<F extends Features>(
  str: string,
  flags: string,
  features?: F
): RootNode<F>;
