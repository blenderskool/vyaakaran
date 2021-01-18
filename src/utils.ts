import { ParseTree, Token } from "./regular-grammar/types";

/**
 * Checkes whether the first character in the parameter
 * is an upper case alphabet
 * @param char Character to check
 */
function isUpperAlpha(char: string) {
  const charCode = char.charCodeAt(0);

  return charCode >= 65 && charCode <= 90;
}

/**
 * Prints the parsed string
 * @param root Parse tree root
 */
function printParseTree(root: ParseTree) {
  if (!root) return;

  if (root.body) {
    for(let i=0; i < root.body.length-1; i++) {
      printParseTree(root.body[i] as ParseTree);
    }
  }

  if (!root.body) {
    process.stdout.write(root.type+" ");
  }

  if (root.body) {
    printParseTree(root.body[root.body.length-1] as ParseTree);
  }
}


export { isUpperAlpha, printParseTree };
