import { TestInput } from "./input";
import { GraphHandler } from "./graph";
import { StateTransitionGrammar } from ".";

let turingMachine = new StateTransitionGrammar(
  "S (a:x)->-Q1 \n  Q1 (a:a)->-Q1 \n Q1 (b:b)->-Q1 \n Q1 (y:y)-<-Q2 \n Q1 (#:#)-<-Q2 \n Q2 (b:y)-<-Q3 \n Q3 (a:a)-<-Q3 \n Q3 (b:b)-<-Q3 \n Q3 (x:x)->-S\n S (y:y)->- *Q4"
);

let ast = turingMachine.parseSemanticAnalysis();
if (turingMachine.errors.length === 0) {
  let graphObj = new GraphHandler(ast).graphGenerate();

  if (graphObj.errors.length === 0) {
    let str = "aabbb#";
    let testObj = new TestInput(str, graphObj.edgeList);

    let generator = testObj.CheckString();

    do {
      console.log(generator.next());
    } while (!generator.next().done);
  } else {
    console.log("Graph Errors: ", graphObj.errors);
  }
} else {
  console.log("Turing machine Errors: ", turingMachine.errors);
}
