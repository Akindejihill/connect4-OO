/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player{
  constructor(name, color){
    this.name = name;
    this.color = color;
  }

  //when the game is reset, delete all properties so that the garbage collector
  //can erase this object.
  allowErase(){
    delete this.name;
    delete this.color;
  }
}

const gameData = {
  gameNum: 0,  //keeps track of how many games have been created
  addGame: function(){this.gameNum++}
};


class Game {
  constructor(y, x){
    this.WIDTH = x;
    this.HEIGHT = y;

    this.makeBoard();
    this.makeHtmlBoard();
  }

  currPlayer = player1; // active player: 1 or 2
  board = [];   // array of rows, each row is array of cells  (board[y][x])
  top;    //the clickable top row on the game board
  clickEventHandle = this.handleClick.bind(this); //create a handle for our event handle
  gameNum;

  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    gameData.addGame(); //and to count of games
    this.gameNum = gameData.gameNum; //record which game this is

    const board = document.createElement("table");
    board.classList.add("board");

    const gameArea = document.getElementById("game");
    gameArea.append(board);

    // make column tops (clickable area for adding a piece to that column)
    this.top = document.createElement('tr');
    this.top.setAttribute('id', 'column-top');
    this.top.addEventListener('click', this.clickEventHandle);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      this.top.append(headCell);
    }

    board.append(this.top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `game${this.gameNum}:${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

/** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(this.currPlayer.name);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`game${this.gameNum}:${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.top.removeEventListener('click', this.clickEventHandle);
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
      // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won game ${this.gameNum}!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer.name === "Player1" ? player2 : player1;
  }

/** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    //changed to an arrow function so that "this" doesn't change to the parent function
    let _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

//at the start of a game, new objects are assigned as player1 and player2
let player1;
let player2;

function startGame(){

  p1Color = document.getElementById("p1color");
  p2Color = document.getElementById("p2color");

  player1 = new Player("Player1", p1Color.value);
  player2 = new Player("Player2", p2Color.value);
  new Game(6, 7);
}



const startButton = document.getElementById("start_button");
startButton.addEventListener("click", startGame);



