exports.getRandomInt = function(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.genererTableau = function ()
{
    var tableau = [];
    for(i = 0; i<103; i++)
    {
	    		if(i<15)
	    			tableau[i] = "E";
	    		if(i<25 && i>14)
	    			tableau[i] = "A";
	    		if(i>24 && i<33)
	    			tableau[i] = "I";
	    		if(i>32 && i<39)
	    			tableau[i] = "N";
	    		if(i>38 && i<45)
	    			tableau[i] = "I";
	    		if(i>44 && i<51)
	    			tableau[i] = "R";
	    		if(i>50 && i<57)
	    			tableau[i] = "S";
	    		if(i>56 && i <63)
	    			tableau[i] = "T";
	    		if(i>62 && i<68)
	    			tableau[i] = "U";
	    		if(i>67 && i<73)
	    			tableau[i] = "L";
	    		if(i>72 && i<76)
	    			tableau[i] = "D";
	    		if(i>75 && i<79)
	    			tableau[i] = "M";
	    		if(i>78 && i<82)
	    			tableau[i] = "G";
	    		if(i>81 && i<84)
	    			tableau[i] = "B";
	    		if(i>83 && i<86)
	    			tableau[i] = "C";
	    		if(i>85 && i<88)
	    			tableau[i] = "P";
	    		if(i>87 && i<90)
	    			tableau[i] = "_";
	    		if(i>89 && i<92)
	    			tableau[i] = "F";
	    		if(i>91 && i<94)
	    			tableau[i] = "H";
	    		if(i>93 && i<96)
	    			tableau[i] = "V";
	    		if(i==96)
	    			tableau[i] = "J";
	    		if(i==97)
	    			tableau[i] = "Q";
	    		if(i==98)
	    			tableau[i] = "K";
	    		if(i==99)
	    			tableau[i] = "W";
	    		if(i==100)
	    			tableau[i] = "X";
	    		if(i==101)
	    			tableau[i] = "Y";
	    		if(i==102)
	    			tableau[i] = "Z";
    		}
    		return tableau;
}