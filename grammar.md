
## Right linear grammar syntax
### Iteration 1
This grammar supports syntax for the right linear grammar which has one literal and/or state in every term, and statemen tends with a new line.

```
<statement> ::= "state" "->" <term> <expression> <end-statement>
<end-statement> ::= "\n" <end-follow> | ""
<end-follow> ::= <statement> | ""
<expression> ::= "|" <term> <expression> | ""
<term> ::= "state" | "literal" <next-term> | "#"
<next-term> ::= "state" | ""
```

### Iteration 2
This grammar supports right linear grammar which has one or more literals (separated by `.`) and/or state in every term. Statement need not end with newline character and can overflow to additional lines.

```
<statement> ::= "state" "->" <symbol> <expression> <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= "state" | "literal" <next-term>
<next-term> ::= "." <term> | ""
<symbol> ::= <term> | "#"
```