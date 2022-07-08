const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

//Minimax function
class Move{
	constructor(){
		let row,col;
	}
}

let player = 'o', opponent = 'x';

//function to check if there are any empty cells returns true if empty cell is present
function isMovesLeft(grid){
	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			if (grid[i][j] == '_'){
				return true;
			}
		}
	}
				
	return false;
}

//function to check who is winning
function evaluate(b){
	
	for(let row = 0; row < 3; row++){
		if (b[row][0] == b[row][1] && b[row][1] == b[row][2]){
			if (b[row][0] == player)
				return +10;
				
			else if (b[row][0] == opponent)
				return -10;
		}
	}

	for(let col = 0; col < 3; col++){
		if (b[0][col] == b[1][col] && b[1][col] == b[2][col]){
			if (b[0][col] == player)
				return +10;

			else if (b[0][col] == opponent)
				return -10;
		}
	}

	if (b[0][0] == b[1][1] && b[1][1] == b[2][2]){
		if (b[0][0] == player)
			return +10;
			
		else if (b[0][0] == opponent)
			return -10;
	}

	if (b[0][2] == b[1][1] && b[1][1] == b[2][0]){
		if (b[0][2] == player)
			return +10;
			
		else if (b[0][2] == opponent)
			return -10;
	}

	return 0;
}

// This is the minimax function. It considers all the possible ways the game can go and returns the value of the grid
function minimax(grid, depth, isMax){

	let score = evaluate(grid);
	if (score == 10)
		return score;

	if (score == -10)
		return score;

	if (isMovesLeft(grid) == false)
		return 0;

	if (isMax){
		let best = -1000;
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){				
				if (grid[i][j]=='_'){					
					grid[i][j] = player;
					best = Math.max(best, minimax(grid, depth + 1, !isMax));
					grid[i][j] = '_';
				}
			}
		}
		return best;
	}

	else{
		let best = 1000;
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){				
				if (grid[i][j] == '_'){					
					grid[i][j] = opponent;
					best = Math.min(best, minimax(grid, depth + 1, !isMax));
					grid[i][j] = '_';
				}
			}
		}
		return best;
	}
}

// This will return the best possible move for the player
function findBestMove(grid){
	let bestVal = -1000;
	let bestMove = new Move();
	bestMove.row = -1;
	bestMove.col = -1;

	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			if (grid[i][j] == '_'){
				grid[i][j] = player;
				let moveVal = minimax(grid, 0, false);
				grid[i][j] = '_';
				if (moveVal > bestVal){
					bestMove.row = i;
					bestMove.col = j;
					bestVal = moveVal;
				}
			}
		}
	}

	return bestMove;
}

const cellPos = [["cell0", "cell1", "cell2"],
                 ["cell3", "cell4", "cell5"],
                 ["cell6", "cell7", "cell8"]]

const cellId = {"cell0":{row:0, col:0},
                "cell1":{row:0, col:1},
                "cell2":{row:0, col:2},
                "cell3":{row:1, col:0},
                "cell4":{row:1, col:1},
                "cell5":{row:1, col:2},
                "cell6":{row:2, col:0},
                "cell7":{row:2, col:1},
                "cell8":{row:2, col:2}}

//Execution Starts
let grid
let cpu = true
let r = 0
let c = 0

startGame()

restartButton.addEventListener('click', startGame)

friendButton.addEventListener('click', function(){
    cpu = false
    startGame()
})

cpuButton.addEventListener('click', function(){
    cpu = true
    startGame()
})

function startGame() {
  circleTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
  //Set the grid to blank
  grid = [ [ '_', '_', '_' ],
		   [ '_', '_', '_' ],
		   [ '_', '_', '_' ] ];
}

function handleClick(e) {
  let cell = e.target
  if(grid[cellId[cell.id].row][cellId[cell.id].col] !='_') return;
  let currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
  //fill the grid
  //update the values of r and c  
  grid[cellId[cell.id].row][cellId[cell.id].col] = 'x';
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
  if(cpu){
    //get best move from minimax
    let bestMove = findBestMove(grid);
    grid[bestMove.row][bestMove.col] = 'o'
    //place mark in the board
    cell = document.getElementById(cellPos[bestMove.row][bestMove.col])
	//disable the cell that is marked by the computer
	document.getElementById(cellPos[bestMove.row][bestMove.col]).disabled = true; 	
    currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
      endGame(false)
    } else if (isDraw()) {
      endGame(true)
    } else {
      swapTurns()
      setBoardHoverClass()
    }
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
  }
  winningMessageElement.classList.add('show')
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}
