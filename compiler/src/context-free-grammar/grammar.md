
## Context Free Grammar syntax
### Iteration 1
This grammar supports syntax for the context free grammar which has a mix of terminals and non-terminals(separated by `.`) in every term. Statement need not end with newline character and can overflow to additional lines.

#### Backus–Naur form
```
<statement> ::= <non-terminal> "->" <symbol> <expression> <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= <non-terminal> <next-term> | <terminal> <next-term>
<next-term> ::= "." <term> | ""
<symbol> ::= <term> | "#"
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+
```

#### Vyaakaran grammar syntax
```
S -> Statement.
Statement -> non-terminal follow Symbol Expression Statement | #.
Expression -> or Symbol Expression | #.
Term -> non-terminal NextTerm | terminal NextTerm.
NextTerm -> dot Term | #.
Symbol -> Term | empty.
```

### Iteration 2
Context free grammar which has a mix of terminals and non-terminals(separated by space - ' ') in every term. Statement need not end with newline character and can overflow to additional lines. Every rule must end with a dot - '.'

#### Backus–Naur form
```
<statement> ::= <non-terminal> "->" <symbol> <expression> "." <statement> | ""
<expression> ::= "|" <symbol> <expression> | ""
<term> ::= <non-terminal> <next-term> | <terminal> <next-term>
<next-term> ::= <term> | ""
<symbol> ::= <term> | "#"
<non-terminal> ::== [A-Z]+
<terminal> ::== [a-z0-9_]+
```

#### Vyaakaran grammar syntax
```
S -> Statement.
Statement -> non-terminal follow Symbol Expression dot Statement | #.
Expression -> or Symbol Expression | #.
Term -> non-terminal NextTerm | terminal NextTerm.
NextTerm -> Term | #.
Symbol -> Term | empty.
```