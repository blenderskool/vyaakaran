import { GraphHandler } from "./graph";
import { StateTransitionSemanticAnalyser } from "./semantic";
import { StateTransitionLexer } from "./lexer";

import { StateTransitionParser } from "./parser";
import { CompilerClass } from "../regular-grammar/types";
import { astObj } from "./types";

export class StateTransitionGrammar extends CompilerClass {
  graphObj: GraphHandler;
  astObj: astObj;

  constructor(program: string) {
    super(program);
  }

  private lex() {
    const tokenStream = new StateTransitionLexer(this.program).tokenizer();

    if (tokenStream.errors.length > 0) {
      for (let error of tokenStream.errors) {
        let message = `${error.message} at ${error.line}:${error.column}`;

        this.errors.push({
          type: "Error",
          message: message,
        });
      }
    }

    return tokenStream;
  }

  parse() {
    const lexRes = this.lex();
    if (lexRes.errors.length > 0) return this;

    const parserObj = new StateTransitionParser();
    parserObj.input = lexRes.tokens;
    let cstOutput = parserObj.grammarStart();

    if (parserObj.errors.length > 0) {
      parserObj.errors.forEach((err) => {
        this.errors.push({
          type: "Error",
          message: `${err.message} at ${err.token.startLine}:${err.token.startColumn}`,
        });
      });
      return this;
    }

    const cstVisitorInstance = new StateTransitionSemanticAnalyser();
    this.astObj = cstVisitorInstance.visit(cstOutput);

    return this;
  }

  semanticAnalysis() {
    if (this.errors.length > 0) return this;

    this.graphObj = new GraphHandler(this.astObj);
    this.graphObj.graphGenerate();

    this.parseTree = this.graphObj.edgeList;

    this.errors.push(...this.graphObj.errors);
    this.warnings.push(...this.graphObj.warnings);

    return this;
  }
}
