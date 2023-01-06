import { CompileError } from "../regular-grammar/types";
import { TuringMachineAST, TuringMachineStateTransition } from "./types";

export class GraphHandler {
  private ast: TuringMachineAST;
  private vertices: Set<string>;
  edgeList: Map<string, TuringMachineStateTransition[]>;
  errors: CompileError[];
  warnings: CompileError[];

  constructor(ast: TuringMachineAST) {
    this.ast = ast;
    this.vertices = new Set<string>();
    this.edgeList = new Map<string, TuringMachineStateTransition[]>();
    this.errors = [];
    this.warnings = [];
  }

  private graphStateInit(state: string) {
    if (!this.edgeList.get(state)) this.edgeList.set(state, []);
  }

  private graphEdgeAdd(state: string, info: TuringMachineStateTransition) {
    this.edgeList.get(state)!.push(info);
  }

  graphGenerate() {
    let tempAst = this.ast;
    while (tempAst) {
      this.graphStateInit(tempAst.currState);
      this.graphEdgeAdd(tempAst.currState, {
        readSymbol: tempAst.replacementSymbols.readSymbol,
        writeSymbol: tempAst.replacementSymbols.writeSymbol,
        transition: tempAst.transitionSymbols,
        nextState: tempAst.nextState,
      });

      this.vertices.add(tempAst.currState);
      this.vertices.add(tempAst.nextState);

      tempAst = tempAst.grammarStart;
    }

    return this.startFinalSameCheck()
      .unreachabilityCheck()
      .startFinalRequirementCheck()
      .sameReadSymbolCheck();
  }

  private startFinalSameCheck() {
    this.vertices.forEach((state) => {
      if (state[0] === "*" && this.vertices.has(state.substring(1))) {
        this.errors.push({
          type: "Error",
          message: `The state ${state.substring(
            1
          )} may or may not be a final state`,
        });
      }
    });

    return this;
  }

  private unreachabilityCheck() {
    if (this.errors.length > 0) return this;

    let visited = new Map<string, boolean>();
    this.vertices.forEach((state) => {
      visited.set(state, false);
    });

    let queue: string[] = ["S"];
    visited.set("S", true);
    while (queue.length !== 0) {
      let remEle = queue.shift();

      if (this.edgeList.has(remEle!)) {
        this.edgeList.get(remEle!)?.forEach((stateTrans) => {
          if (visited.get(stateTrans.nextState) === false) {
            queue.push(stateTrans.nextState);
            visited.set(stateTrans.nextState, true);
          }
        });
      }
    }

    let msg = "";
    for (let state of visited) {
      if (state[1] === false) {
        msg += state[0] + ", ";
        this.edgeList.delete(state[0]);
      }
    }
    if (msg.length !== 0) {
      this.warnings.push({
        type: "Warning",
        message: `${msg.substring(
          0,
          msg.length - 2
        )} not reachable from the start state`,
      });
    }

    return this;
  }

  private startFinalRequirementCheck() {
    if (this.errors.length > 0) return this;

    if (!this.edgeList.has("S")) {
      this.errors.push({
        type: "Error",
        message: "Turing machine has no starting State ->S<-",
      });
      return this;
    }

    let finalStates = new Set<string>();
    for (let state of this.edgeList.keys()) {
      if (state[0] === "*") {
        this.errors.push({
          type: "Error",
          message: "Final state has an outgoing edge",
        });
        return this;
      }

      for (let stateTrans of this.edgeList.get(state)!) {
        if (stateTrans.nextState[0] === "*") {
          finalStates.add(stateTrans.nextState);
          if (finalStates.size > 1) {
            this.errors.push({
              type: "Error",
              message: "There is more than one final state",
            });
            return this;
          }
        }
      }
    }

    if (finalStates.size === 0) {
      this.errors.push({
        type: "Error",
        message: "There is no valid final state",
      });
    }

    return this;
  }

  private sameReadSymbolCheck() {
    if (this.errors.length > 0) return this;

    for (let edge of this.edgeList) {
      let readSymbols = new Set();
      edge[1].forEach((stateTrans) => {
        if (readSymbols.has(stateTrans.readSymbol)) {
          this.errors.push({
            type: "Error",
            message: `${edge[0]} has multiple edges with read symbol ${stateTrans.readSymbol}`,
          });
        }
        readSymbols.add(stateTrans.readSymbol);
      });
    }

    return this;
  }
}
