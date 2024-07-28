import { GraphHandler } from './graph';
import { StateTransitionLexer } from './lexer';
import { StateTransitionSemanticAnalyser } from './semantic';

import { CompilerClass } from '../types';
import { StateTransitionParser } from './parser';
import { TuringMachineAST } from './types';

export class StateTransitionGrammar extends CompilerClass {
  graphObj: GraphHandler;
  astObj: TuringMachineAST;

  constructor(program: string) {
    super(program);
  }

  private lex() {
    const tokenStream = new StateTransitionLexer(this.program).tokenizer();

    if (tokenStream.errors.length > 0) {
      for (const error of tokenStream.errors) {
        const message = `${error.message} at ${error.line}:${error.column}`;

        this.errors.push({
          type: 'Error',
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
    const cstOutput = parserObj.grammarStart();

    if (parserObj.errors.length > 0) {
      parserObj.errors.forEach((err) => {
        this.errors.push({
          type: 'Error',
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

export * from './types';
export * from './input';