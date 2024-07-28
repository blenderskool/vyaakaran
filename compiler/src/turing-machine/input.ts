import { TuringMachineStateTransition } from "./types";

export class TestInput {
  private input: string;
  private tape: string[];
  private vertices: Map<string, TuringMachineStateTransition[]>;

  constructor(input: string, vertices: Map<string, TuringMachineStateTransition[]>) {
    this.input = input;
    this.tape = [];
    this.vertices = vertices;
  }
  private toTape(str: string ) {
    for (let index = 0;  index < 100 ; index++) {
      this.tape.push("#")
    }
    for (const i of str) {
      this.tape.push(i);
    }
    for (let index = 0; index < 100; index++) {
      this.tape.push("#")
    }
  }
  private tMove(m: string) {
    let move: number;
    if (m == "<") move = -1;
    else if (m == ">") move = 1;
    else move = 0;
    return move;
  }
  private initTape() {
    this.tape = [];
  }
  *CheckString() {
    let s = "S";
    let flag = true;
    let index = 100;
    this.initTape();
    this.toTape(this.input);
    const value = {
      moveDir: 100,
      string: this.tape,
      accepted: false,
    };
    yield value;
    while (this.vertices.get(s) && flag) {
      while (
        index <= this.tape.length + 1 &&
        flag &&
        this.vertices.get(s)
      ) {
        let statecount = 0;
        for (const j of this.vertices.get(s)) {
          if (this.tape[index] == j.readSymbol) {
            this.tape[index] = j.writeSymbol;
            // value.moveDir = this.tMove(j.transition);
            index = index + this.tMove(j.transition);
            value.moveDir=index
            s = j.nextState;
            if (s[0] == "*") {
              value.accepted = true;
              yield value;
            }
            break;
          } else {
            statecount = statecount + 1;
          }
          if (statecount >= this.vertices.get(s).length) {
            flag = false;
            yield value;
          }
          value.string = this.tape;
          yield value;
        }
      }
    }
    return value;
  }
  consoleTestString() {
    let s = "S";
    let flag = true;
    let index = 100;
    this.initTape();
    this.toTape(this.input);
    while (this.vertices.get(s) && flag) {
      while (
        index <= this.tape.length + 1 &&
        flag &&
        this.vertices.get(s)
      ) {
        let statecount = 0;
        for (const j of this.vertices.get(s)) {
          if (this.tape[index] == j.readSymbol) {
            this.tape[index] = j.writeSymbol;
            index = index + this.tMove(j.transition);
            s = j.nextState;
            if (s[0] == "*") {
              return true;
            }
            break;
          } else {
            statecount = statecount + 1;
          }
          if (statecount >= this.vertices.get(s).length) {
            flag = false;
            return false;
          }
        }
      }
    }
    return false;
  }
}
