import { readFile } from 'fs';
import { RegularGrammarParser, RegularGrammarSemanticAnalyzer } from './regular-grammar';

function handleError(error) {
  console.log('Error occurred', error);
}

readFile(process.argv[2], (err, data) => {
  const [result, error] = new RegularGrammarParser(data.toString()).parse();
  if (error) return handleError(error);

  {
    const analysis = new RegularGrammarSemanticAnalyzer(result).analyze();
    const warnings = analysis.filter(e => e.type === 'Warning');
    const errors = analysis.filter(e => e.type === 'Error');
    if (errors.length) return handleError(errors);
    if (warnings.length) console.log('Warnings', warnings);
  }

  console.log(JSON.stringify(result, null, '  '));
});
