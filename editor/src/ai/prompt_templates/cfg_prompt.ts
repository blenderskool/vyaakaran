export const generateContextFreeGrammarPrompt = (userRequest: string,exampleStrings:string[]=[]): string => `
You are tasked with generating a context-free grammar (CFG) based on a user's request. Your goal is to create a valid grammar that satisfies the given language requirements and can be validated using an example string.

Here is the user's request:
<user_request>
${userRequest}
</user_request>

And here is an example string to validate the grammar:
<example_string>
${exampleStrings}
</example_string>

Follow these steps to generate and validate the grammar:

1. Analyze the user's request carefully to understand the language requirements.

2. Generate a context-free grammar using the following Backus-Naur Form (BNF) syntax:

<statement> ::= <non-terminal> "->" <symbol> <expression> "." <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= <non-terminal> <next-term> | <terminal> <next-term>
<next-term> ::= <term> | ""
<symbol> ::= <term> | "#"
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+

3. Ensure that your grammar strictly follows this syntax. Each production rule should be on a new line and end with a period.

4. After generating the grammar, validate it using the provided example string. Check if the grammar can generate the example string.

5. If the validation fails, regenerate the grammar, making necessary adjustments to satisfy both the user's request and the example string.

6. Repeat steps 4 and 5 until you have a valid grammar that satisfies both the language requirements and can generate the example string.

7. Present your final grammar in the following format:

<grammar>
[Your generated grammar here, with each production rule on a new line]
</grammar>

<validation>
[Explain how the grammar satisfies the user's request and can generate the example string]
</validation>

Remember to adhere strictly to the BNF syntax provided and ensure that your grammar accurately represents the language described in the user's request while being able to generate the given example string.
`;