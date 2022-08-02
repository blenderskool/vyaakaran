export const dropDownData = [
	{
		name: "a^n b^n c^n",
		code: `S (a:x)->-Q1
Q1 (a:a)->-Q1
Q1 (b:b)->-Q1 
Q1 (y:y)-<-Q2 
Q1 (#:#)-<-Q2 
Q2 (b:y)-<-Q3  
Q3 (a:a)-<-Q3  
Q3 (b:b)-<-Q3  
Q3 (x:x)->-S
S (y:y)->- *Q4`,
	},
	{
		name: "Equal number of a's and b's",
		code: `S (x:x) ->- S
S (a:x) ->- Q1
S (b:x) ->- Q2
S (#:#) -=- *Q4
Q1 (a:a) ->- Q1
Q1 (x:x) ->- Q1
Q1 (b:x) -<- Q3
Q2 (b:b) ->- Q2
Q2 (x:x) ->- Q2
Q2 (a:x) -<- Q3
Q3 (a:a) -<- Q3 
Q3 (b:b) -<- Q3 
Q3 (x:x) -<- Q3 
Q3 (#:#) ->- S`,
	},
];
