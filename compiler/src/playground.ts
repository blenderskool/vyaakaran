import { readFile } from 'node:fs';
import { resolve } from 'node:path';
import { ContextFreeGrammar } from './context-free-grammar';
// import { RegularGrammarParser, RegularGrammarSemanticAnalyzer, RegularGrammar } from './regular-grammar';

const filePath = process.argv[2];
if (!filePath) {
  console.error("Missing file parameter.");
  console.log(`
Usage: Create a file with the source code to process and pass the path to this file.
Example:
 - pnpm run compiler:playground code.txt
 - cd compiler && pnpm run playground code.txt
`);
  process.exit(1);
}

readFile(resolve(process.cwd(), filePath), (err, data) => {
  if (err !== null) {
    console.log(err);
    return;
  }

  const output = new ContextFreeGrammar(data.toString())
    .parse()
    .semanticAnalysis();

  if (output.errors.length) {
    return console.log('Error occurred', output.errors);
  }
  if (output.warnings.length) {
    console.log('Warnings', output.warnings);
  }

  console.log("Successfully parsed the program");
});
