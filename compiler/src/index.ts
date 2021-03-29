import { readFile } from 'fs';
import { ContextFreeGrammar } from './context-free-grammar';
// import { RegularGrammarParser, RegularGrammarSemanticAnalyzer, RegularGrammar } from './regular-grammar';

readFile(process.argv[2], (err, data) => {
  const output = new ContextFreeGrammar(data.toString())
    .parse()
    .semanticAnalysis();

  if (output.errors.length) {
    return console.log('Error occurred', output.errors);
  }
  if (output.warnings.length) {
    console.log('Warnings', output.warnings);
  }
});
