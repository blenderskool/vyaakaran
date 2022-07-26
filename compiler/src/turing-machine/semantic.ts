import { StateTransitionParser } from "./parser";

export class StateTransitionSemanticAnalyser extends new StateTransitionParser().getBaseCstVisitorConstructor() {
  constructor() {
    super();
    this.validateVisitor();
  }

  grammarStart(ctx: any) {
    const currState = this.visit(ctx.currState[0]);
    const replacementSymbols = this.visit(ctx.replacementSymbols);
    const transitionSymbols = this.visit(ctx.transitionSymbols);
    const nextState = this.visit(ctx.nextState[0]);
    if (ctx.consumeNewLine && ctx.grammarStart) {
      const consumeNewLine = this.visit(ctx.consumeNewLine);
      const grammarStart = this.visit(ctx.grammarStart);

      return {
        currState: currState,
        replacementSymbols: replacementSymbols,
        transitionSymbols: transitionSymbols,
        nextState: nextState,
        consumeNewLine: consumeNewLine,
        grammarStart: grammarStart,
      };
    }

    return {
      currState: currState,
      replacementSymbols: replacementSymbols,
      transitionSymbols: transitionSymbols,
      nextState: nextState,
    };
  }

  consumeState(ctx: any) {
    if (ctx.State) return ctx.State[0].image;
    else if (ctx.StartState) return ctx.StartState[0].image;
    else return ctx.FinalState[0].image;
  }

  replacementSymbols(ctx: any) {
    const readSymbol = this.visit(ctx.readSymbol[0]);
    const writeSymbol = this.visit(ctx.writeSymbol[0]);

    return {
      readSymbol: readSymbol,
      writeSymbol: writeSymbol,
    };
  }

  consumeSymbol(ctx: any) {
    return ctx.Symbol[0].image;
  }

  transitionSymbols(ctx: any) {
    return ctx.Dir[0].image;
  }

  consumeNewLine(ctx: any) {
    return ctx.NewLine[0].image;
  }
}


