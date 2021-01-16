import { readFile } from 'fs';
import { RegularGrammarParser } from './regular-grammar';


readFile(process.argv[2], (err, data) => {
  const [result, error] = new RegularGrammarParser(data.toString()).parse();

  if (error) {
    console.log('Error occurred', error);
  } else {
    console.log(result);
  }
});
