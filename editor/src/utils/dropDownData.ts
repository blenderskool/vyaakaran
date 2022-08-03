export const dropDownDataTM = [
	{
		name: "N number of a's and b's",
		code: `// Σ = {a, b}
// S -> Start State
// *Q4 -> Final State

S ( a : x ) ->- Q1
S ( y : y ) ->-  *Q4

Q1 ( a : a ) ->- Q1
Q1 ( b : b ) ->- Q1 
Q1 ( y : y ) -<- Q2 
Q1 ( # : # ) -<- Q2 

Q2 ( b : y ) -<- Q3 
	
Q3 ( a : a ) -<- Q3  
Q3 ( b : b ) -<- Q3  
Q3 ( x : x ) ->- S`,
	},
	{
		name: "Equal number of a's and b's",
		code: `// Σ = {a, b}
// S -> Start State
// *Q4 -> Final State

S ( x : x ) ->- S
S ( a : x ) ->- Q1
S ( b : x ) ->- Q2
S ( # : # ) -=- *Q4

Q1 ( a : a ) ->- Q1
Q1 ( x : x ) ->- Q1
Q1 ( b : x ) -<- Q3

Q2 ( b : b ) ->- Q2
Q2 ( x : x ) ->- Q2
Q2 ( a : x ) -<- Q3

Q3 ( a : a ) -<- Q3 
Q3 ( b : b ) -<- Q3 
Q3 ( x : x ) -<- Q3 
Q3 ( # : # ) ->- S`,
	},
	{
		name: "N number of a's, b's and c's",
		code: `// Σ = {a, b, c}
// S -> Start State
// *Q5 -> Final State

S ( a : x ) ->- Q1
S ( y : y ) ->- Q4

Q1 ( y : y ) ->- Q1
Q1 ( a : a ) ->- Q1
Q1 ( b : y ) ->- Q2

Q2 ( z : z ) ->- Q2
Q2 ( b : b ) ->- Q2
Q2 ( c : z ) -<- Q3

Q3 ( a : a ) -<- Q3
Q3 ( y : y ) -<- Q3
Q3 ( b : b ) -<- Q3
Q3 ( z : z ) -<- Q3
Q3 ( x : x ) ->- S

Q4 ( y : y ) ->- Q4
Q4 ( z : z ) ->- Q4
Q4 ( # : # ) ->- *Q5`,
	},
	{
		name: "Palindrome of even length",
		code: `// Σ = {a, b, c}
// S -> Start State
// *Q15 -> Final State

S ( b : y ) ->- Q1
S ( a : x ) ->- Q1
S ( # : # ) -<- Q7

Q1 ( b : b ) ->- Q1
Q1 ( a : a ) ->- Q1
Q1 ( # : # ) -<- Q2

Q2 ( b : # ) ->- Q3
Q2 ( a : # ) ->- Q4

Q3 ( # : b ) -<- Q5

Q4 ( # : a ) -<- Q5

Q5 ( # : # ) -<- Q6

Q6 ( a : a ) -<- Q6
Q6 ( b : b ) -<- Q6
Q6 ( x : x ) ->- S
Q6 ( y : y ) ->- S

Q7 ( x : a ) -<- Q7
Q7 ( y : b ) -<- Q7
Q7 ( # : # ) ->- Q8

Q8 ( a : x ) ->- Q9
Q8 ( b : y ) ->- Q10
Q8 ( # : # ) ->- *Q15

Q9 ( b : b ) ->- Q9
Q9 ( a : a ) ->- Q9
Q9 ( # : # ) ->- Q11

Q10 ( a : a ) ->- Q10
Q10 ( b : b ) ->- Q10
Q10 ( # : # ) ->- Q12

Q11 ( y : y ) ->- Q11
Q11 ( x : x ) ->- Q11
Q11 ( a : x ) -<- Q13

Q12 ( y : y ) ->- Q12
Q12 ( x : x ) ->- Q12
Q12 ( b : y ) -<- Q13

Q13 ( x : x ) -<- Q13
Q13 ( y : y ) -<- Q13
Q13 ( # : # ) -<- Q14

Q14 ( a : a ) -<- Q14
Q14 ( b : b ) -<- Q14
Q14 ( x : x ) ->- Q8
Q14 ( y : y ) ->- Q8`,
	},
];

export const dropDownDataRG = [
	{
		name: "m number of a's followed by n number of b's | n,m>=0",
		code: `S -> A|B.
A ->aA|#.
B ->bB|#.`,
	},
	{
		name: "L={abw, w∈{a,b}*}",
		code: `S -> aA.
A -> bB.
B -> aB|bB|#.`,
	},
];

export const dropDownDataCFG = [
	{
		name: "L={num of a in w ≠ num of b in w, w∈{a,b}*}",
		code: `S -> A|B.
A -> aAb|bAa|AA|aA|Aa|a.
B -> aBb|bBa|BB|bB|Bb|b.`,
	},
	{
		name: "L={num of a in w = num of b in w+1, w∈{a,b}*}",
		code: `S -> aSb|bSa|a|SS.`,
	},
];
