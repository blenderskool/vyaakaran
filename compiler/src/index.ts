import { readFile } from 'fs';
import { RegularGrammarParser, RegularGrammarSemanticAnalyzer, RegularGrammar } from './regular-grammar';

readFile(process.argv[2], (err, data) => {
  const output = new RegularGrammar(data.toString())
    .parse()
    .semanticAnalysis();

  if (output.errors.length) {
    return console.log('Error occurred', output.errors);
  }
  if (output.warnings.length) {
    return console.log('Warnings', output.warnings);
  }

  console.log(output.toFA().result);
});
