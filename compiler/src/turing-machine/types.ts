export type TuringMachineParseTree = Map<string, TuringMachineStateTransition[]>;

export interface TuringMachineAST {
  currState: string;
  replacementSymbols: { readSymbol: string; writeSymbol: string };
  transitionSymbols: string;
  nextState: string;
  consumeNewLine: string;
  grammarStart: TuringMachineAST;
}

export interface TuringMachineStateTransition {
  readSymbol: string;
  writeSymbol: string;
  transition: string;
  nextState: string;
}