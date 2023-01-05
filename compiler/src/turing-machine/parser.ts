import {
  Colon,
  Dir,
  FinalState,
  Hyphen,
  LParen,
  NewLine,
  RParen,
  StartState,
  State,
  Symbol,
  TokenList,
} from "./lexer";
import { CstNode, CstParser, ParserMethod } from "chevrotain";

export class StateTransitionParser extends CstParser {
  grammarStart: ParserMethod<unknown[], CstNode> | any;
  consumeState: ParserMethod<unknown[], CstNode> | any;
  replacementSymbols: ParserMethod<unknown[], CstNode> | any;
  transitionSymbols: ParserMethod<unknown[], CstNode> | any;
  consumeSymbol: ParserMethod<unknown[], CstNode> | any;
  consumeNewLine: ParserMethod<unknown[], CstNode> | any;

  constructor() {
    super(TokenList);

    const $ = this;

    $.RULE("grammarStart", () => {
      $.SUBRULE($.consumeState, { LABEL: "currState" });
      $.SUBRULE($.replacementSymbols);
      $.SUBRULE($.transitionSymbols);
      $.SUBRULE2($.consumeState, { LABEL: "nextState" });
      $.OPTION(() => {
        $.SUBRULE($.consumeNewLine);
        $.SUBRULE($.grammarStart);
      });
    });

    $.RULE("consumeState", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(State),
        },
        {
          ALT: () => $.CONSUME(StartState),
        },
        {
          ALT: () => $.CONSUME(FinalState),
        },
      ]);
    });

    $.RULE("replacementSymbols", () => {
      $.CONSUME(LParen);
      $.SUBRULE($.consumeSymbol, { LABEL: "readSymbol" });
      $.CONSUME(Colon);
      $.SUBRULE2($.consumeSymbol, { LABEL: "writeSymbol" });
      $.CONSUME(RParen);
    });

    $.RULE("consumeSymbol", () => {
      $.CONSUME(Symbol);
    });

    $.RULE("transitionSymbols", () => {
      $.CONSUME(Hyphen);
      $.CONSUME(Dir);
      $.CONSUME1(Hyphen);
    });

    $.RULE("consumeNewLine", () => {
      $.CONSUME(NewLine);
    });

    this.performSelfAnalysis();
  }
}
