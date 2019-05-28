var board;
var revealed;
var gameOver;
var totalRows = 10;
var totalCols = 10;
var startTime;
var frequency = .2;
var score = 0;
var numCleared = 0;
var maxScore = 10000;
var game = 0;

// Builds a new, blank game board and starts the game. Has a default size
// of 10x10 with a bomb frequency of 20%.
function buildBoard() {
  startTime = new Date().getTime();
  totalRows = Number(document.getElementById("rows").value);
  totalCols = Number(document.getElementById("columns").value);
  if (document.getElementById("frequency").value != "")
    frequency = Number(document.getElementById("frequency").value) / 100;
  if (frequency <= 0 )
    frequency = .2;
  if (totalCols < 1)
    totalCols = 10;
  if (totalRows < 1 )
    totalRows = 10;
  board = [];
  revealed = [];
  game++;
  for (var r = 0; r < totalRows; r++) {
    var temp1 = [totalCols];
    var temp2 = [totalCols];
    board.push(temp1);
    revealed.push(temp2);
    for (var c = 0; c < totalCols; c++) {
        board[r][c] = 0;
        revealed[r][c] = false;
    }
  }
  gameOver = false;
  document.getElementById("result").innerHTML = "Game in progress";
  document.getElementById("hide").style.display = "block";
  $("table").html("");
  var table = document.createElement("table");
  for (var r = 0; r < board.length; r++) {
    var tableRow = document.createElement("tr");
    for (var c = 0; c < board[r].length; c++) {
      var square = document.createElement("td");
      square.onclick = function() {reveal(this, event);};
      tableRow.appendChild(square);
    }
    document.getElementById("field").appendChild(tableRow);
  }
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      if (Math.random() < frequency)
        board[r][c] = -1;
    }
  }
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      if (board[r][c] > -1)
        board[r][c] = getNumber(r,c);
    }
  }
}

// Returns the number of bombs in adjacent squares to the square in
// position (row,col) of board
function getNumber(row, col) {
  var num = 0;
  var squares = [0,0,0,0,0,0,0,0];
  if (row > 0) {
    squares[1] = board[row - 1][col];
    if (col > 0)
      squares[0] = board[row - 1][col - 1];
    if (col < board[row].length - 1)
      squares[2] = board[row - 1][col + 1];
  }
  if (col > 0)
    squares[3] = board[row][col - 1];
  if (col < board[row].length - 1)
    squares[4] = board[row][col + 1];

  if (row + 1 < board.length) {
    squares[6] = board[row + 1][col];
    if (col > 0)
      squares[5] = board[row + 1][col - 1];
    if (col < board[row].length - 1)
      squares[7] = board[row + 1][col + 1];
  }
  for (var i = 0; i < squares.length; i++) {
      if (squares[i] == -1)
        num++;
  }
  return num;
}

// Returns a -1 if the user has lost, a 1 if the user has won, and 0 if
// the game is still in progress. Also updates the score.
function checkResult() {
  var win = true;
  for (var r = 0; r < board.length; r++) {
    for (var c = 0; c < board[r].length; c++) {
      if (board[r][c] == -1 && revealed[r][c]){
        win = false;
        gameOver = true;
        getScore(0);
        var temp = document.createElement("p");
        temp.innerHTML = "Game " + game + ": " + score;
        document.getElementById("scores").appendChild(temp);
        return -1;
      }
      if (board[r][c] != -1 && !revealed[r][c])
        win = false;
    }
  }
  getScore(1);
  if (win) {
    gameOver = true;
    var temp = document.createElement("p");
    temp.innerHTML = "Game " + game + ": " + score;
    document.getElementById("scores").appendChild(temp);
    return 1;
  }
  return 0;
}

// Toggles the a space between flagged and un-flagged.
function flag(space) {
  if (space.innerHTML == "") {
    space.innerHTML = "🚩";
    space.style.backgroundColor = "#f0f0f0";
  }
  else if (space.innerHTML == "🚩") {
    space.innerHTML = "";
    space.style.backgroundColor = "#c1c1c1";
  }
}

// Sets a space to visible if the user isn't trying to flag it, otherwise
// passes the space object to the flag() function.
function reveal(space, event) {
    if (!gameOver) {
      if (event.altKey)
        flag(space);
      else {
        space.style.backgroundColor = "white";
        var col = space.cellIndex;
        var row = space.parentElement.rowIndex;
        if (board[row][col] != -1) {
          space.innerHTML = board[row][col];
          if (!revealed[row][col])
            numCleared++;
        }
        else
          space.innerHTML = "💣";
        revealed[row][col] = true;
        var result = checkResult();
        if (result == -1)
          document.getElementById("result").innerHTML = "Game Over";
        else if (result == 1)
          document.getElementById("result").innerHTML = "You Win!";
      }
    }
}

// Returns the score of the player, calculated using the number of squares
// revealed as well as how much time has passed since the user created the game.
function getScore(x) {
  if (x != 0) {
    score = maxScore - (new Date().getTime() - startTime) / 50;
    score = Math.floor(score);
    if (score < 0)
      score = 0;
    score += numCleared * 20;
    document.getElementById("score").innerHTML = "Score: " + score;
    }
    else {
      score = 0;
      document.getElementById("score").innerHTML = "Score: 0";
  }
}
