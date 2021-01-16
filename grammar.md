
## Right linear grammar syntax
### Iteration 1
This grammar supports syntax for the right linear grammar which has one terminal and/or non-terminal in every term, and statement ends with a new line.

```
<statement> ::= <non-terminal> "->" <term> <expression> <end-statement>
<end-statement> ::= "\n" <end-follow> | ""
<end-follow> ::= <statement> | ""
<expression> ::= "|" <term> <expression> | ""
<term> ::= <non-terminal> | <terminal> <next-term> | "#"
<next-term> ::= <non-terminal> | ""
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+
```

### Iteration 2
This grammar supports right linear grammar which has one or more terminals (separated by `.`) and/or non-terminal in every term. Statement need not end with newline character and can overflow to additional lines.

```
<statement> ::= <non-terminal> "->" <symbol> <expression> <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= <non-terminal> | <terminal> <next-term>
<next-term> ::= "." <term> | ""
<symbol> ::= <term> | "#"
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+
```