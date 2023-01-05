export interface 2 {
  currState: string;
  replacementSymbols: { readSymbol: string; writeSymbol: string };
  transitionSymbols: string;
  nextState: string;
  consumeNewLine: string;
  grammarStart: astObj;
}

export interface stateTransition {
  readSymbol: string;
  writeSymbol: string;
  transition: string;
  nextState: string;
}

export interface errorWarning {
  type: "error" | "warning";
  message: string;
}
