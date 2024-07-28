export interface IProvider {
  generateRightRegularGrammar(userRequest: string, exampleStrings: string[]): Promise<string>;
  generateContextFreeGrammar(userRequest: string, exampleStrings: string[]): Promise<string>;
}