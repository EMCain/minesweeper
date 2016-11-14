const MINIMUM_MINES = 3; 

	function Square(x, y){
		this.x = x; 
		this.y = y;
		this.isMine = false;
		this.adjacent = 0;
	}
	
	Square.prototype.reveal = function(){
		var query = '[data-x="' + this.x +'"][data-y="' + this.y + '"]';
		var cell = document.querySelector(query);
		cell.className += " revealed";
	}
	
	function Board(h, w, m) {
		this.width = w;
		this.height = h;
		this.squares = [];
		for (var i = 0; i < this.height; i++) {
			this.squares[i] = [];
			for (var j = 0; j < this.width; j++) {
			this.squares[i][j] = new Square(i, j); // I think this is right for x and y 			
			}
		}
		this.mines = m; 
	}
	
	
	Board.prototype.revealSquare = function(event){
		var data = event.currentTarget.dataset;
		x = data.x;
		y = data.y;
			reveal(x, y);
		if(data.isMine == "true"){
			// iterateOverSquares(reveal, this); // reveal all squares TODO scope issues--can't call this.iterateOverSquares
			lose();
		}
		else if(document.querySelectorAll('#board .hidden').length <= myBoard.mines){
			win();
		}
	}
	
	// separating this out allows for revealing all when game ends. 
	// may want to pass in the "cell" instead of x and y. 
	function reveal(x, y){
		var query = '[data-x="' + x +'"][data-y="' + y + '"]';
		var cell = document.querySelector(query);
		cell.className = "revealed";
		if (cell.dataset["isMine"] == "true") {
			cell.innerHTML = "*"
		} else if (cell.dataset["adjacent"] != "0") {
			cell.innerHTML = cell.dataset.adjacent;
		}
	}
	
	Board.prototype.randomMines = function(){
		// TODO error handling: set a max number of mines
		var sq = [];
		this.iterateOverSquares(function(i, j){
			sq.push({"y": i, "x": j}); // one-dimensional array of coordinate pairs
		}, this)
		for (var i = 0; i < this.mines; i++){
			var rand = Math.floor(Math.random()*(sq.length));
			var square = sq.splice(rand, 1)[0];
			this.squares[square["y"]][square["x"]].isMine = true;
		}
	}
	
	Board.prototype.iterateOverSquares = function(callback, callbackObj){
		for(var i = 0; i < this.height; i++){
			for(var j = 0; j < this.width; j++){
			callback.call(callbackObj, i, j);
			}
		}
	}
	
	Board.prototype.getAdjacent = function(x, y){
		var count = 0;
		for (var i = x-1; i <= x+1; i++) {
			if (i < 0 || i >= this.height) {
			continue;
		}
			for (var j = y-1; j <= y+1; j++) {
			if (j < 0 || j >= this.width) {
				continue;
			}
			if (this.squares[i][j].isMine) {
				count++;
			}
		}
		}		
		this.squares[x][y].adjacent = count;
	}
	
	Board.prototype.render = function() {
		var self = this; // for event listener
		var board = document.getElementById("board");
		board.innerHTML = "";
		for(var i = 0; i < this.height; i++) {
			var row = board.insertRow(i);
		for(var j = 0; j < this.width; j++) {
			var sq = this.squares[i][j];
			var cell = row.insertCell(j);
			cell.className = "hidden";
			cell.addEventListener("click", self.revealSquare);
			for (var property in this.squares[i][j]) {
				if (this.squares[i][j].hasOwnProperty(property)) {
						cell.dataset[property] = this.squares[i][j][property]
					}
				}		
			}
		}
	}
	
function newGame(height, width, mines){
	myBoard = new Board(height, width, mines);
	myBoard.randomMines();
	myBoard.iterateOverSquares(myBoard.getAdjacent, myBoard);		
	myBoard.render();
}	

function newGameFromInputs(){ // TODO iterate to get values
	var width = parseInt(document.getElementById("width").value);
	var height = parseInt(document.getElementById("height").value);
	var mines = parseInt(document.getElementById("mines").value);

	if(mines > height*width/2){
		mines = heigth*width/2; 
	}
	if(mines < MINIMUM_MINES) {
		mines = MINIMUM_MINES;
	}
	
	newGame(height, width, mines);
}

function win(){
	alert("Congratulations! You won!");
	var wins = parseInt(document.getElementById("wins").innerHTML);
	wins++; 
	document.getElementById("wins").innerHTML = wins;
	newGameFromInputs();
}

function lose(){
	alert("Game over! You lost.");
	var losses = parseInt(document.getElementById("losses").innerHTML);
	losses++; 
	document.getElementById("losses").innerHTML = losses;
	newGameFromInputs();
}
	
document.addEventListener("DOMContentLoaded", function(event) { 
	newGameFromInputs();
	document.getElementById("new_game").addEventListener("click", newGameFromInputs);
	
});