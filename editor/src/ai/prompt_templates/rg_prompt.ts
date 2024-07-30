export const generateRightRegularGrammarPrompt = (
  userRequest: string,
  exampleStrings: string[] = []
): string => `
You are tasked with generating a right-regular grammar based on a user's request. Your goal is to create a grammar that follows the specified syntax and accurately represents the language described in the user's request.

First, let's review the Backus-Naur Form (BNF) syntax for right regular grammar:

<bnf>
<statement> ::= <non-terminal> "->" <symbol> <expression> "." <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= <non-terminal> | <terminal> <next-term>
<next-term> ::= <term> | ""
<symbol> ::= <term> | "#"
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+
</bnf>

Here are some examples of right regular grammars that follow this syntax:

<examples>
Example 1:
S -> 0 A | 1 B .
A -> 0 S | 1 C .
B -> 0 C | 1 S .
C -> 0 B | 1 A .

Example 2:
S -> a A .
A -> b B .
B -> a B | b B | # .

Example 3:
S -> A | 1 B | 0 .
A -> 0 A | S .
B -> 0 S | 1 B | # .

Example 4:
S -> 0 S | 1 S | 0 A | 1 B .
A -> 1 .
B -> 0 .
</examples>

Now, follow these steps to generate the right regular grammar:

1. Carefully read the user's request:
<user_request>
${userRequest}
</user_request>

2. Analyze the language description and identify the key components (e.g., alphabet, patterns, constraints).

3. Design the grammar productions that satisfy the language requirements, following the BNF syntax strictly.

4. Write the grammar productions, ensuring that:
   - Each production starts with a non-terminal symbol (uppercase letter)
   - Productions use "->" to separate the left and right sides
   - Multiple options on the right side are separated by "|"
   - Each production ends with a "."
   - The empty string is represented by "#"

5. After generating the grammar, validate it using the example string provided:
<example_string>
${exampleStrings}
</example_string>

6. If the grammar fails to generate the example string, revise and regenerate the grammar until it correctly produces the example string.

7. Once you have a valid grammar, present your final output in the following format:

<grammar>
[List your grammar productions here, one per line]
</grammar>

<explanation>
[Provide a brief explanation of how the grammar works and how it satisfies the user's request]
</explanation>

Remember to strictly adhere to the BNF syntax and the format of the example grammars provided. Your goal is to create a correct and efficient right regular grammar that accurately represents the language described in the user's request.
`;
