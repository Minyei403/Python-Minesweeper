var size = 0;
var bombs = 0;
var flaggedCells = [];
var gameOver = false;
var won = false;
var timer; 
var timeLeft = 60; // seconds

// What to do when the timer runs out
function gameOver() {
  // This cancels the setInterval, so the updateTimer stops getting called
  cancelInterval(timer);
  
  // re-show the button, so they can start it again
  $('#playAgainButton').show();
}

function updateTimer() {
  timeLeft = timeLeft - 1;
  if(timeLeft >= 0)
    $('#timer').html(timeLeft);
  else {
    gameOver();
  }
}

// The button has an on-click event handler that calls this
function start() {
  // setInterval is a built-in function that will call the given function
  // every N milliseconds (1 second = 1000 ms)
  timer = setInterval(updateTimer, 1000);
  
  // It will be a whole second before the time changes, so we'll call the update
  // once ourselves
  updateTimer();
  
  // We don't want the to be able to restart the timer while it is running,
  // so hide the button.
   $('#playAgainButton').hide();
}
function startNew(mode) {
  // Easy   -> 7X10=70 	   -> 10 bombs  | 10 -> 15 bombs
  // medium -> 12X25=300   -> 40 bombs  | 18 -> 45 bombs
  // hard   -> 18X32=576   -> 100 bombs | 24 -> 100 bombs
  // Pendar-> 26X50=1300  -> 220 bombs | 30 -> 200 bombs
  // const mode = element.value;
  if (mode === "easy") {
    size = 10;
    bombs = 15;
    document.getElementById("board").classList.remove("zoomOut");
  } else if (mode === "medium") {
    size = 10;
    bombs = 15;
    document.getElementById("board").classList.remove("zoomOut");
  } else if (mode === "hard") {
    size = 10;
    bombs = 15;
    document.getElementById("board").classList.add("zoomOut");
  } else if (mode === "Pendar") {
    size = 30;
    bombs = 200;
    document.getElementById("board").classList.add("zoomOut");
  }

  gameOver = false;
  flaggedCells = [];
  document.getElementById("h1").classList.remove("won");
  document.getElementById("h1").classList.remove("lost");
  document.getElementById("h1").innerHTML = `Uwaterloo Minesweeper`;
  eel.makeBoard(size, bombs)(); //size, bombs
  drawFirst();
}

function updateList(string) {
  // console.log(string.length);
  let toAdd = "";
  let intSec = 0;
  let intFirst = 0;
  let theName = "";
  if (!string.includes("B") && string.split("E").length - 1 == bombs) {
    document.getElementById("h1").innerHTML = `You won`;
    document.getElementById("h1").classList.add("won");
    // console.log("WON");
    won = true;
  }
  for (let i = 0; i < string.length; i++) {
    intFirst = Math.floor(i / size);
    intSec = i % size;
    theName = intFirst + "-" + intSec;
    if (flaggedCells.includes(theName)) {
      toAdd += `<input class="cell flagged empty" type="button" onmousedown="printBoard(this, event)" name="${theName}" value=' ' />`;
    } else if (string[i] == "E") {
      toAdd += `<input class="cell empty" type="button" onmousedown="printBoard(this, event)" name="${theName}" value=' ' />`;
    } else if (string[i] == "0") {
      toAdd += `<input class="cell on" type="button" onmousedown="printBoard(this, event)" name="${theName}" value=' ' />`;
    } else if (string[i] == "B") {
      toAdd += `<input class="cell bomb" type="button" onmousedown="printBoard(this, event)" name="${theName}" value=' ' />`;
      gameOver = true;
      document.getElementById("h1").innerHTML = `Game Over`;
      document.getElementById("h1").classList.add("lost");
      // console.log("GameOver");
    } else {
      toAdd += `<input class="cell on number" type="button" onmousedown=" printBoard(this, event)" name="${theName}" value='${string[i]}' />`;
    }
    if (i % size == size - 1) {
      toAdd += `</br>`;
    }
    if (gameOver) {
      // i++;
    }
  }
  document.getElementById("board").innerHTML = toAdd;
}

function drawNewCells(string) {
  let toAdd = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      toAdd += `<input class="cell" type="button" onmousedown="printBoard(this, event)"  name="${i}-${j}" id="${i}-${j}"/>`;
    }
    toAdd += "</br>";
  }
  document.getElementById("board").innerHTML = toAdd;
}

async function printBoard(element, event) {
  if (
    event.button == 0 &&
    !element.classList.contains("flagged") &&
    !element.classList.contains("on") &&
    !gameOver &&
    !won
  ) {
    const x = element.name.split("-")[1];
    const y = element.name.split("-")[0];
    let newCells = await eel.clickedOnTheCell(parseInt(x), parseInt(y))();
    // console.log(newCells);
    clearTimeout();
    element.classList.add("animation");

    setTimeout(function () {
      updateList(newCells);
    }, 10);
  } else if (
    event.button == 2 &&
    !element.classList.contains("on") &&
    !gameOver &&
    !won
  ) {
    let classOfElement = element.classList;
    event.preventDefault();
    if (!classOfElement.contains("flagged")) {
      classOfElement.add("flagged");
      flaggedCells.push(element.name);
    } else {
      classOfElement.remove("flagged");
      flaggedCells = flaggedCells.filter((item) => item !== element.name);
    }
  }
}

// eel.expose(showTheBoard);
// function showTheBoard(string) {}

function drawFirst() {
  let toAdd = "";
  document.getElementById("board").innerHTML = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      toAdd += `<input class="cell empty" type="button" onmousedown="printBoard(this, event)" name="${i}-${j}" value=" " />`;
    }
    toAdd += "</br>";
  }
  document.getElementById("board").innerHTML += toAdd;
}

//todo  set cookie (Later)
startNew("easy");

var themes = ["pink", "green", "dark", "red", "yellow", "armin", "brown"];
function changeTheme(name) {
  const body = document.getElementById("body");
  body.className = "";

  if (themes.includes(name)) {
    body.classList.add(name);
  } else {
    body.classList.add("pink");
  }
}
changeTheme("pink");
