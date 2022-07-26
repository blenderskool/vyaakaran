export class TestInput {
  input: string;
  tape: string[];
  vertices: Map<any, any>;
  constructor(input: string, vertices: Map<any, any>) {
    this.input = input;
    this.tape = [];
    this.vertices = vertices;
  }
  totape(str: string) {
    for (var i of str) {
      this.tape.push(i);
    }
  }
  tmove(m: string) {
    let mv: number;
    if (m == "<") mv = -1;
    else if (m == ">") mv = 1;
    else mv = 0;
    return mv;
  }
  * CheckString() 
  {
    var s = "S";
    var flag = true;
    let index = 0;
    this.totape(this.input);
    // console.log(this.tape);
    yield this.tape
    while (this.vertices.get(s) && flag) 
    {
      while (index <= this.tape.length + 1 && flag && this.vertices.get(s)) 
      {
        var scount = 0;
        for (var j of this.vertices.get(s)) 
        {
          if (this.tape[index] == j.readSymbol) 
          {
            // console.log("current state " + s);
            // console.log("char read " + this.tape[index]);
            // console.log("write " + j.writeSymbol);
            this.tape[index] = j.writeSymbol;
            var t = this.tmove(j.transition);
            index = index + t;
            s = j.nextState;
            // console.log(this.tape);
            // console.log("next state " + s);
            if (s[0] == "*") 
            {
              console.log("accepted ");
            } 
            break;
          } 
          else {
            scount = scount + 1;
          }
          if (scount >= this.vertices.get(s).length) {
            flag = false;
            console.log("failed");
          }
           yield this.tape 
        }
      }
    }
    return this.tape
  }
}
