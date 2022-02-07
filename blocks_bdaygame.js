/** Main Goal: Create a blocks game that displays a grid of tiles. Blocks drop into the grid from the top. Goal of the game is to deftly maneveur 
               the blocks to make lines and score points.
**/

var tiles = [];
var NUM_ROWS = 25;
var NUM_COLS = 10;
var offset_x = 70;
var offset_y = 40;
var gaps = 18; //gaps = size of the square tile + padding
var blockColor = "#F3DCAD";
var clearColor = "#012C0B";
var blockSize = 16;
var pieceList = [];
var currentBlock;
var currentInd;
var currentForm = 0;
var myScore = 0;
var gameStop = false;


//Different block pieces and their variants
var piecePos =   [
                     [ [3,0,4,0,5,0,4,1], [5,0,5,1,5,2,4,1], [5,1,4,1,3,1,4,0],[3,2,3,1,3,0,4,1]],//gul
					 [ [4,0,5,0,5,1,5,2], [5,0,5,1,4,1,3,1], [4,2,3,2,3,1,3,0],[3,1,3,0,4,0,5,0]], //mikan
					 [ [4,0,3,0,3,1,3,2], [5,1,5,0,4,0,3,0], [4,2,5,2,5,1,5,0],[3,0,3,1,4,1,5,1]], //vaan
					 [ [3,0,4,0,4,1,5,1], [3,2,3,1,4,1,4,0]], //ebony
					 [ [3,1,4,1,4,0,5,0], [4,0,4,1,5,1,5,2]], //atarazia
					 [ [4,0,4,1,4,2,4,3], [3,0,4,0,5,0,6,0]], //tim
					 [ [4,0,5,0,4,1,5,1]] //paloma
					];					
					
var pieceShift = [
					 [ [2,0,1,1,0,2,0,0], [0,2,-1,1,-2,0,0,0], [-2,0,-1,-1,0,-2,0,0], [0,-2,1,-1,2,0,0,0]],
					 [ [1,1,0,2,-1,1,-2,0], [-1,1,-2,0,-1,-1,0,-2], [-1,-1,0,-2,1,-1,2,0], [1,-1,2,0,1,1,0,2]],
					 [ [1,1,2,0,1,-1,0,-2], [-1,1,0,2,1,1,2,0], [-1,-1,-2,0,-1,1,0,2], [1,-1,0,-2,-1,-1,-2,0]],
					 [ [0,2,-1,1,0,0,-1,-1], [0,-2,1,-1,0,0,1,1]],
					 [ [1,-1,0,0,1,1,0,2], [-1,1,0,0,-1,-1,0,-2]],
					 [ [-1,0,0,-1,1,-2,2,-3] , [1,0,0,1,-1,2,-2,3]],
					 [ [0,0,0,0,0,0,0,0]]
				 ];
var pieceColor = ["#FF6464", "#FF6701","#172774","#11052C", "#77D970","#3EC1D3","#EAA81B"];

function startGame() {
    myGameArea.start();
	 
}

//Main Game function: 
function updateGame() {  
    
	currentBlock.movedown();
}

//Helper functions that takes the row & column position of a tile in a grid and returns x & y coordinates
function calcPosX(index)
{	return index * gaps + offset_x;}
function calcPosY(index)
{	return index * gaps + offset_y;}

function button_moveup()
{	currentBlock.moveup(); }
function button_movedown()
{   currentBlock.movedown();}
function button_moveright()
{   currentBlock.moveright();}
function button_moveleft()
{   currentBlock.moveleft();}

//Creates the game canvas and places it within the HTML DOM
var myGameArea = {
    canvas : document.createElement("canvas"),
	// start function will be called on load of the document
    start : function() {
        this.canvas.width = 320;
        this.canvas.height = 530;
        this.context = this.canvas.getContext("2d");
        myScore = 0;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]); //inserts the canvas element into doc
	    
		//FILL GRID OF TILES
		//Create a GRID of NUM_ROWS x NUM_COLS rectangles. Each rectangle is a component with its height, width, posx , posy 
	    for (var i = 0; i < NUM_ROWS; i++) {
	    // Index i refers to the row number --> grid is filled starting from top to bottom
        for (var j = 0; j < NUM_COLS; j++) {
	    // Index j refers to the column number --> tile is placed starting from left to right
        var  tileX = calcPosX(j);
        var  tileY = calcPosY(i);
        tiles.push(new component(blockColor, tileX, tileY, i*NUM_COLS + j)); //new component to fill the grid 
        }
	    }
		
		//Create all the pieces required for the game & link the actions to be down with the arrow press 
		this.createPieceForm();
	    this.context.font = '15px serif';
        this.context.fillStyle='yellow';
		this.context.fillText(("SCORE:"),200,20); 
		this.context.fillText((""+myScore),280,20);
		document.addEventListener("keydown", function(e)
												 {if (e.code == "ArrowDown") currentBlock.movedown();
												  else if (e.code == "ArrowRight") currentBlock.moveright();
											      else if (e.code == "ArrowLeft") currentBlock.moveleft();
												  else if (e.code == "ArrowUp") currentBlock.moveup();
												  
												 }, false);
												 
		this.dropNewBlock();
		this.interval = setInterval(updateGame,2000);
    },
	createPieceForm :function() //Create the pieces of the game 
	{  var tempForm;
	   for(var k =0; k < pieceColor.length; k++) // for each piece 
	   { tempForm = [];
		for(var i = 0; i< piecePos[k].length; i++) // for each form of the piece
		{	tempForm.push(new gamePiece( pieceColor[k],
		                                  piecePos[k][i][0],piecePos[k][i][1],piecePos[k][i][2],piecePos[k][i][3], piecePos[k][i][4],piecePos[k][i][5], piecePos[k][i][6],piecePos[k][i][7],
										  pieceShift[k][i][0],pieceShift[k][i][1],pieceShift[k][i][2],pieceShift[k][i][3],pieceShift[k][i][4],pieceShift[k][i][5],pieceShift[k][i][6],pieceShift[k][i][7] 
										 ));
	    }
		pieceList[k] = tempForm;
	   }
	},
	showScore : function()
	{   this.context.fillStyle =  "FF0075"; //#BD245F";
		this.context.fillRect(250, 5, 70, 20);
		this.context.font = '15px serif';
		this.context.fillStyle='yellow';
		this.context.fillText((""+myScore),280,20);
	},
	clearLines : function()
	{  let temp, startIndex,isLine;
	   var flag = 0;
	   //Check for lines -- for now, check all lines starting from the top
	    for(var i = 0; i< NUM_ROWS; i++)
		{  isLine = true;
		   for (var j = 0; j< NUM_COLS; j++)
		   { temp = i * NUM_COLS + j;
		     if(tiles[temp].isFree) //i.e. there is a Free unoccupied tile in the line => do not clear
			    isLine = false;
		   }
		   if(isLine)
		   {   flag++; 
		       for (var j = 0; j< NUM_COLS; j++)
			         tiles[i * NUM_COLS + j].drawComponent(clearColor); //change color of line to be clear color, so it can be identified & removed in the shift pass
		   }
	    }
     
		if(flag > 0) //i.e. there's atleast one line in the grid
		{	//Shift the cleared lines --> note only the color and isFree status is shifted duh! because the grid is the grid after all.
			for(var p = NUM_ROWS - 1; p>=0 ; )
				{ temp = p * NUM_COLS;
				  startIndex = temp;
				  while(tiles[temp].tileColor == clearColor && temp >= 0)
					{ temp = temp - NUM_COLS;
					} //keep moving to the next line above till a non-full line is found
					 
				  if(startIndex == temp) //i.e.this line is not a full line to be cleared 
				      p = p - 1;
				  else //this row is to be cleared 
				  {	myScore = myScore + 10; // 10 points every line
					for(var j = startIndex + NUM_COLS - 1, k=temp + NUM_COLS - 1; j>=0 && k>=0; j--, k--) // shifting all the way down till start line
			        {     tiles[j].isFree = tiles[k].isFree;
						  tiles[j].drawComponent(tiles[k].tileColor);
				    }
					p = startIndex / NUM_COLS - 1 ;
				  }
				}
			this.showScore();
			//When all the lines have been cleared, ensure that the top rows corresponding to cleared lines are marked as Free and color is the unoccupied tile color
			  temp = (flag * NUM_COLS - 1);  
			  while(temp>=0)
			  { tiles[temp].isFree = true;
			    tiles[temp].drawComponent(blockColor);
				temp--;
			  }
			  //
		}
	},
	//generate a random block to get dropped.
	dropNewBlock : function()
	{           
	    //reset the current form, i.e. indX and indY to be the original form 
	    let tempPiece, temp, maxj = 0;
		let tempForm = pieceList[currentForm]; 
		
		this.clearLines();
		
	    for(var i = 0; i< tempForm.length; i++) //For each variant of the current form
		{ temp = 0;
		  for(var j =0; j< tempForm[i].piece.length; j++) //For each part in the variant piece
		  { tempPiece = tempForm[i].piece[j]; 
		    tempPiece.indX = piecePos[currentForm][i][temp]; //reset x-position to the original x-position of this part of variant piece 
			tempPiece.indY = piecePos[currentForm][i][temp + 1]; //reset y-position to the original y-position of this part of variant piece
            temp = temp + 2;
	      }
		}	
		currentForm = Math.floor((Math.random()*pieceColor.length)); // pick a form that is to be chosen
		currentInd = Math.floor((Math.random()*pieceList[currentForm].length)); //pick a variant of the form to be chosen
		currentBlock = pieceList[currentForm][currentInd];
		currentBlock.drawPiece(currentBlock.pieceColor);
		if(!currentBlock.checkPiece(0,false,NUM_COLS)) //i.e. the new piece is not valid, i.e. can occupy empty tiles  
				{ 
				  this.stop();
				}
	},
	
	stop : function() {
		clearInterval(this.interval);
		gameStop = true;
		window.alert("Game over!!");
		var info = document.getElementById("info");
		info.innerHTML = "Thanks: <br/> To Mom & Dad & Hari </br> To UT Ma'am, all my CS profs, W3Schools, P.Norvig, C.Ogden & CS50 team  & Youtube recommendation algorithm </br> To Sowmya, Aish, Sandhya, Maha, Madhu, Ruchi, Uma, Ghazala, Kalpita & all my friends for their time & support <br/> To A.Gilchrist, R.Sapolsky, N.Djokovic, Y.Kanno, C.Evans, N.Shihab Nye, I.Takahata, S.Watanabe , Nujabes & ARR for some enjoyable momments.";		
	},
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //Clearing the canvas
    }	
}

//Template for creating new components - takes parameters of size, position, color & index (redundant) just for tracking
function component(color, x, y) {
    //Setting the parameters
	this.tileColor = color;
    this.x = x;
    this.y = y;    
	this.isFree = true;
	ctx = myGameArea.context;
	ctx.beginPath();
	ctx.fillStyle = this.tileColor;
	ctx.fillRect(this.x, this.y, blockSize, blockSize);
	
	//Helper function that helps in drawing 
	this.drawComponent = function(newColor) {
	this.tileColor = newColor;
	ctx.fillStyle = newColor;
	ctx.fillRect(this.x, this.y, blockSize, blockSize);
	}
}

//
function quadpiece(indX, indY, shiftX, shiftY) {
    //Setting the parameters index x , y in the grid and the position on canvas
	this.indX = indX;
    this.indY = indY;   
	this.shiftX = shiftX;
	this.shiftY = shiftY;
}

function gamePiece(colors, x1, y1, x2, y2, x3, y3, x4, y4, m1,n1, m2, n2, m3, n3, m4, n4) {
	this.piece = []; //Using new Array(4) just inserted undefined 
	this.pieceColor = colors; // "#77D970";
	this.piece.push(new quadpiece(x1,y1,m1,n1));
	this.piece.push(new quadpiece(x2,y2,m2,n2));
	this.piece.push(new quadpiece(x3,y3,m3,n3));
	this.piece.push(new quadpiece(x4,y4,m4,n4));
	
    //Helper function to run through a set of indices and check if all the parts of a piece are withing the game grid
	this.checkPiece = function(shift, isDownMove, maxInd )
	{    let temp, tempx, tempy;
	     for(var i = 0, flag = 1; i< this.piece.length; i++)
		 {  if(isDownMove) { temp = this.piece[i].indY;  tempx = this.piece[i].indX; tempy = temp + shift; }//Decides whether to consider row or column.
				else 	   { temp = this.piece[i].indX; tempy = this.piece[i].indY; tempx = temp + shift;}
			temp = temp + shift; 
			if(temp < 0 || temp >= maxInd)//check bounds of the grid
			   flag = 0;
			//check for occupied tile, i.e. underlying tile is unoccupied
			temp = tempy * NUM_COLS + tempx;
			if (flag && !(tiles[temp].isFree))
				flag = 0;
		 }
		 return flag;
	}
	
    // Helper function that clears old position and displays new position of block
	this.drawPiece= function(newColor)
	{	 let temp;
	     for(var i = 0; i< this.piece.length; i++)
		 {  temp = this.piece[i].indY * NUM_COLS + this.piece[i].indX;
		    tiles[temp].drawComponent(newColor);
		 }
	}

	//Function to be called when down arrow is pressed. will move the piece down by 1 row => y index increased by 1
	this.movedown= function() {	
	    if(gameStop) return;
		
	    let maxY = 0; //to help calculate score of block as max Y position of the piece  
		if(this.checkPiece(1,true,NUM_ROWS)) {
		    this.drawPiece(blockColor);
			for (var i = 0 ; i < this.piece.length; i++ )
				{ this.piece[i].indY = this.piece[i].indY + 1;
				}
			this.drawPiece(this.pieceColor);
		}
		else //i.e. there is no movedown => time for a new block
		{ //Make the underlying tiles occupied 
		  for (var i = 0,temp= 0 ; i < this.piece.length; i++ )
				{ if(this.piece[i].indY > maxY) maxY = this.piece[i].indY;
				  temp = this.piece[i].indY * NUM_COLS + this.piece[i].indX;
				  tiles[temp].isFree = false;
				}
		  //Add max Y to the score 
		      myScore =  myScore+ Math.floor(maxY/4);
			  myGameArea.showScore();
		  //Call the function of GameArea to drop new block
		  myGameArea.dropNewBlock();
		}
    }
	
	//Function to be called when right arrow is pressed. will move the piece right by 1 column => x index increased by 1
    this.moveright= function() {
		 if(gameStop) return;
		 if(this.checkPiece(1,false,NUM_COLS)) {
		    this.drawPiece(blockColor);
			for (var i = 0 ; i < this.piece.length; i++ )
				{ this.piece[i].indX = this.piece[i].indX + 1;
				}
			this.drawPiece(this.pieceColor);
		}
	}	   
	
	//Function to be called when left arrow is pressed. will move the piece left by 1 column => x index decreased by 1
	this.moveleft= function() {
	     if(gameStop) return;
		 if(this.checkPiece(-1,false,NUM_COLS)) {
		    this.drawPiece(blockColor);
			for (let i = 0 ; i < this.piece.length; i++ )
				{ this.piece[i].indX = this.piece[i].indX - 1;
				}
			this.drawPiece(this.pieceColor);
		}
	}

	//flip - Transforms the next block into the current block position, checks if the transformed block is valid and if so, resets the current block to the transformed block.	
	this.moveup= function() {
		 if(gameStop) return;
		 let tempForm = pieceList[currentForm];
		 //check length		 
		 if(tempForm.length > 1) // i.e. the current Form has a flippable symmetry 
		 { let nextPiece = tempForm[(currentInd+1)% tempForm.length];
		   //calculate nextPiece's new transformed position 
		   for (let i = 0 ; i < this.piece.length; i++ )
				{ nextPiece.piece[i].indX = this.piece[i].indX + this.piece[i].shiftX;
                  nextPiece.piece[i].indY = this.piece[i].indY + this.piece[i].shiftY;
				}
		  //check if transformed next piece is valid 
		  if(nextPiece.checkPiece(0,false,NUM_COLS)) {
		    //change currentInd & currentBlock
			currentInd = (currentInd+1)% tempForm.length;
			currentBlock = nextPiece;
		 	this.drawPiece(blockColor);
			nextPiece.drawPiece(this.pieceColor);
		 }
		}
	}
} 
