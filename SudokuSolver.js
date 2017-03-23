var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var gridLines = [];
var numberGrid = [];
var texts = [];

// var sampleGrid = [[-1,2,-1,3,4,-1,5,-1,-1],
				// [-1,-1,1,-1,-1,-1,-1,4,7],
				// [-1,5,-1,-1,-1,9,-1,1,3],
				// [1,7,-1,-1,6,-1,-1,5,9],
				// [5,-1,-1,-1,-1,-1,-1,-1,2],
				// [6,3,-1,-1,2,-1,-1,8,1],
				// [7,1,-1,9,-1,-1,-1,2,-1],
				// [4,8,-1,-1,-1,-1,7,-1,-1],
				// [-1,-1,6,-1,8,5,-1,3,-1]];//EASY//5764743646
				
// var sampleGrid = [[-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1]];

// var sampleGrid = [[-1,-1,-1,2,-1,-1,-1,5,-1],
				// [-1,-1,4,-1,-1,8,-1,7,3],
				// [-1,-1,1,6,7,-1,-1,-1,-1],
				// [-1,-1,2,-1,-1,-1,-1,-1,6],
				// [8,7,-1,-1,-1,-1,-1,1,2],
				// [1,-1,-1,-1,-1,-1,9,-1,-1],
				// [-1,-1,-1,-1,2,9,8,-1,-1],
				// [9,2,-1,1,-1,-1,3,-1,-1],
				// [-1,8,-1,-1,-1,3,-1,-1,-1]];//EVIL

				
var sampleGrid = [[8,-1,-1,-1,-1,4,9,-1,-1],
				[-1,-1,-1,3,-1,-1,7,-1,-1],
				[-1,1,-1,-1,6,-1,-1,2,-1],
				[-1,3,4,-1,-1,9,-1,5,-1],
				[-1,-1,-1,4,-1,7,-1,-1,-1],
				[-1,9,-1,1,-1,-1,8,3,-1],
				[-1,5,-1,-1,4,-1,-1,7,-1],
				[-1,-1,6,-1,-1,1,-1,-1,-1],
				[-1,-1,7,6,-1,-1,-1,-1,2]];//HARD
				
// var sampleGrid = [[-1,-1,-1,-1,-1,-1,-1,-1,1],
				// [-1,8,6,1,-1,-1,-1,3,2],
				// [-1,-1,-1,9,-1,3,4,7,-1],
				// [8,-1,-1,7,-1,-1,3,-1,-1],
				// [-1,7,-1,-1,-1,-1,-1,6,-1],
				// [-1,-1,9,-1,-1,8,-1,-1,5],
				// [-1,2,4,3,-1,1,-1,-1,-1],
				// [7,1,-1,-1,-1,5,6,4,-1],
				// [3,-1,-1,-1,-1,-1,-1,-1,-1]];//HARD
				
// var sampleGrid = [[-1,-1,-1,1,-1,-1,-1,-1,3],
				// [3,-1,8,9,-1,-1,1,6,4],
				// [4,-1,-1,-1,8,3,-1,2,-1],
				// [8,1,-1,-1,7,6,-1,-1,-1],
				// [-1,-1,-1,-1,-1,-1,-1,-1,-1],
				// [-1,-1,-1,2,1,-1,-1,8,5],
				// [-1,4,-1,7,9,-1,-1,-1,1],
				// [1,5,9,-1,-1,2,4,-1,8],
				// [2,-1,-1,-1,-1,1,-1,-1,-1]];
				
var clueGrid = []

var xInc = (game.width - 100)/10;
var yInc = (game.height - 100)/10;

function preload() {

	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	
}

function create() {
	
	game.stage.backgroundColor = "#0079a5";
	createGrid();
	drawGrid();
	// createRandomNumbers();
	numberGrid = sampleGrid;
	createClueGrid();
	drawNumbers();
	
	button = game.add.button(game.world.centerX - 95, 500, 'button', solveAndDraw, this, 2, 1, 0);
	
	
}

function solveAndDraw(){
	solveClueGrid();
	solveGrid();
	console.log(clueGrid);
	drawNumbers();
}

//initialize grid lines array
function createGrid(){
	for (i=1;i<=10;i++){
		gridLines.push(new Phaser.Line(xInc*i, 50, xInc*i, game.height-100));
		gridLines.push(new Phaser.Line(70, yInc*i, game.width-100, yInc*i));
	}
}

//fills grid with different numbers
function createRandomNumbers(){
	for(i=0;i<gridLines.length/2;i++){
		numberGrid[i] = []
		for(j=0;j<gridLines.length/2;j++){
			numberGrid[i][j] = (j+i)%9 + 1;
		}
	}
}


//initializes answer/clue grid with full 1-9 possible numbers
function createClueGrid(){
	for(i=0;i<(gridLines.length/2)-1;i++){
		clueGrid[i] = []
		for(j=0;j<(gridLines.length/2)-1;j++){
			clue = new Object();
			clue.availableNumbers = [1,2,3,4,5,6,7,8,9];
			clueGrid[i][j] = clue;
		}
	}
}

//draw numbers in grid
function drawNumbers(){
	if(texts!==null){
		for(z=0;z<texts.length;z++){
			texts[z].destroy();
		}
	}
	for(i=1;i<gridLines.length/2;i++){
		for(j=1;j<gridLines.length/2;j++){
			if(numberGrid[i-1][j-1] === -1){
				texts[(i-1)*9+(j-1)] = game.add.text(xInc*j+27, yInc*i+12, "-");
			}
			else{
				texts[(i-1)*9+(j-1)] = game.add.text(xInc*j+27, yInc*i+12, numberGrid[i-1][j-1]);
			}
		}
	}
}

//draw lines of grid
function drawGrid() {
	for (x=0;x<gridLines.length;x++){
		if(x%6===0 || (x-1)%6===0){
			game.debug.geom(gridLines[x], "#ffffff");
		}
		else{
			game.debug.geom(gridLines[x], "#000000");
		}
	}
}

function solveGrid(){
	for(a=0;a<numberGrid.length;a++){
		for(b=0;b<numberGrid.length;b++){
			if(numberGrid[a][b]===-1 && clueGrid[a][b].availableNumbers.length===1){
				numberGrid[a][b] = clueGrid[a][b].availableNumbers[0];
			}
		}
	}
}

function solveClueGrid(){
	for(i=0;i<numberGrid.length;i++){
		for(j=0;j<numberGrid.length;j++){
			solveHoriz(i,j);
			solveVert(i,j);
			solveNineBlock(i,j);
		}
	}
	solveBlocks();

}

function solveHoriz(x,y){	
	if(numberGrid[x][y]!==-1){
		clueGrid[x][y].availableNumbers = numberGrid[x][y];
	}
	else{
		for(k=0;k<numberGrid.length;k++){
			if(k!==y && numberGrid[x][k]!==-1){
				if(clueGrid[x][y].availableNumbers.includes(numberGrid[x][k])){
					clueGrid[x][y].availableNumbers.splice(clueGrid[x][y].availableNumbers.indexOf(numberGrid[x][k]),1);
				}
			}
			
		}
	}
}

function solveVert(x,y){
	if(numberGrid[x][y]!==-1){
		clueGrid[x][y].availableNumbers = numberGrid[x][y];
	}
	else{
		for(k=0;k<numberGrid.length;k++){
			if(k!==x && numberGrid[k][y]!==-1){
				if(clueGrid[x][y].availableNumbers.includes(numberGrid[k][y])){
					clueGrid[x][y].availableNumbers.splice(clueGrid[x][y].availableNumbers.indexOf(numberGrid[k][y]),1);
				}
			}
		}
	}
}

function solveNineBlock(x1,y1){
	var xMin, yMin;
	if(x1<3){xMin=0;}
	else if(x1<6){xMin=3;}
	else{xMin=6;}
	if(y1<3){yMin=0;}
	else if(y1<6){yMin=3;}
	else{yMin=6;}
	for(a=xMin;a<xMin+3;a++){
		for(b=yMin;b<yMin+3;b++){
			if(numberGrid[a][b]!==-1){
				if(clueGrid[x1][y1].availableNumbers.length > 1 && clueGrid[x1][y1].availableNumbers.includes(numberGrid[a][b])){
					clueGrid[x1][y1].availableNumbers.splice(clueGrid[x1][y1].availableNumbers.indexOf(numberGrid[a][b]),1);
				}
			}
		}
	}
	
}

function solveBlocks(){
	for(i=0;i<9;i+=3){
		for(j=0;j<9;j+=3){
			solveBlock(i,j);
		}
	}
}

function solveBlock(x,y){
	for(m=x;m<x+3;m++){
		for(n=y;n<y+3;n++){
			if(numberGrid[m][n]===-1){
				solveSquare(m,n);
			}
		}
	}
}

function solveSquare(x1,y1){
	var xMin, yMin;
	if(x1<3){xMin=0;}
	else if(x1<6){xMin=3;}
	else{xMin=6;}
	if(y1<3){yMin=0;}
	else if(y1<6){yMin=3;}
	else{yMin=6;}
	var availableNumbers = clueGrid[x1][y1].availableNumbers.slice();
	for(a=xMin;a<xMin+3;a++){
		for(b=yMin;b<yMin+3;b++){
			if((a!==x1 || b!==y1) && numberGrid[a][b]===-1){
				for(c=availableNumbers.length-1;c>=0;c--){
					if(clueGrid[a][b].availableNumbers.includes(availableNumbers[c])){
						availableNumbers.splice(c,1);
					}
				}
			}
		}
	}
	if(availableNumbers.length===1){
		console.log("x1=" + y1 + " y1=" + x1 + " number=" + availableNumbers);
		numberGrid[x1][y1] = availableNumbers[0];
		clueGrid[x1][y1].availableNumbers = availableNumbers;
	}
}

function update() {
}

function render() {
	
}

