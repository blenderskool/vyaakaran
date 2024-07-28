import { Lexer, createToken } from "chevrotain";

export const State = createToken({
  name: "State",
  pattern: /[A-Z]\w*/,
});

export const StartState = createToken({
  name: "StartState",
  pattern: /S/,
  longer_alt: State,
});

export const FinalState = createToken({
  name: "FinalState",
  pattern: /\*[A-Z]\w*/,
});

export const Symbol = createToken({
  name: "Symbol",
  pattern: /[0-9a-z#]/,
});

export const LParen = createToken({
  name: "LParen",
  pattern: /\(/,
});

export const RParen = createToken({
  name: "RParen",
  pattern: /\)/,
});

export const Colon = createToken({
  name: "Colon",
  pattern: /:/,
});

export const Hyphen = createToken({
  name: "Hyphen",
  pattern: /[-]/,
});

export const Dir = createToken({
  name: "Dir",
  pattern: /[=><]/,
});

export const Whitespace = createToken({
  name: "Whitespace",
  pattern: /[^\S\r\n]+/,
  group: Lexer.SKIPPED,
});

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\n/,
});

export const Comment = createToken({
  name: "Comment",
  pattern: /\/\/.*/,
  group: Lexer.SKIPPED,
});

export const TokenList = [
  Whitespace,
  NewLine,

  Comment,

  LParen,
  RParen,
  Colon,
  Hyphen,
  Dir,

  Symbol,
  StartState,
  State,
  FinalState,
];

export class StateTransitionLexer {
  private program: string;

  constructor(program: string) {
    this.program = program;
  }

  tokenizer() {
    const chevLexer = new Lexer(TokenList);
    const tokenRes = chevLexer.tokenize(this.program);

    for (let i = tokenRes.tokens.length - 1; i > 0; i--) {
      if (
        tokenRes.tokens[i].image === "\n" &&
        tokenRes.tokens[i - 1].image === "\n"
      ) {
        tokenRes.tokens.splice(i, 1);
      }
    }

    if (tokenRes.tokens[tokenRes.tokens.length - 1].image === "\n") {
      tokenRes.tokens.splice(tokenRes.tokens.length - 1, 1);
    }

    if (tokenRes.tokens[0].image === "\n") {
      tokenRes.tokens.splice(0, 1);
    }

    return tokenRes;
  }
}
