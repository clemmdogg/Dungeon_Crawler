//
// Settings for tile enum and tile class
//
enum tileType {
  Empty,
  Rock,
  Door,
  Monster,
  Key,
  Sword,
  TreasureChest,
}

class tile {
  tileType: tileType;
  isPlayerOnField: boolean;
  isDiscovered: boolean;
  coordinates: number[];

  constructor(
    tileType: tileType,
    isPlayerOnField: boolean,
    isDiscovered: boolean,
    coordinates: number[]
  ) {
    this.tileType = tileType;
    this.isPlayerOnField = isPlayerOnField;
    this.isDiscovered = isDiscovered;
    this.coordinates = coordinates;
  }
}

//
// Settings for the map
//
// Define board size
const rows: number = 5;
const cols: number = 5;
const tileSize: number = 130;
const borderWidth: number = 0;
const innerBorderWidth: number = 7;

// Setting up the tiles for the maze
const startTiles: tile[] = [
  new tile(tileType.Empty, true, true, [0, 0]),
  new tile(tileType.Empty, false, false, [1, 0]),
  new tile(tileType.Rock, false, false, [2, 0]),
  new tile(tileType.Sword, false, false, [3, 0]),
  new tile(tileType.Empty, false, false, [4, 0]),
  new tile(tileType.Rock, false, false, [0, 1]),
  new tile(tileType.Empty, false, false, [1, 1]),
  new tile(tileType.Rock, false, false, [2, 1]),
  new tile(tileType.Rock, false, false, [3, 1]),
  new tile(tileType.Empty, false, false, [4, 1]),
  new tile(tileType.Empty, false, false, [0, 2]),
  new tile(tileType.Empty, false, false, [1, 2]),
  new tile(tileType.Empty, false, false, [2, 2]),
  new tile(tileType.Empty, false, false, [3, 2]),
  new tile(tileType.Empty, false, false, [4, 2]),
  new tile(tileType.Monster, false, false, [0, 3]),
  new tile(tileType.Rock, false, false, [1, 3]),
  new tile(tileType.Empty, false, false, [2, 3]),
  new tile(tileType.Rock, false, false, [3, 3]),
  new tile(tileType.Rock, false, false, [4, 3]),
  new tile(tileType.Key, false, false, [0, 4]),
  new tile(tileType.Rock, false, false, [1, 4]),
  new tile(tileType.Empty, false, false, [2, 4]),
  new tile(tileType.Door, false, false, [3, 4]),
  new tile(tileType.TreasureChest, false, true, [4, 4]),
];

//
// Setting for the colors
//
const backgroundColor: string = "#e5e4e2";

const isNotDiscoveredColor: string = "#818181";
const isPlayerOnFieldColor: string = "#01ae55";
const monsterColor: string = "#ae0148";
const rockColor: string = "#5b5b5b";
const emptyColor: string = "#c8c8c8";
const swordColor: string = "#5355f7";
const doorColor: string = "#5e03c4";
const keyColor: string = "#03c4b5";
const treasureChestColor: string = "#f5f51e";

const blackColor: string = "#000000";
const whiteColor: string = "#ffffff";

//
// Assigning the variables to the start values
//
let tiles: tile[] = JSON.parse(JSON.stringify(startTiles)); // Stringify to make tiles modifyable without modifying startTiles

let isKeyFound: boolean = false;
let isSwordFound: boolean = false;
let isGameOver: boolean = false;
let monsterKilled: boolean = false;
let doorOpened: boolean = false;
let doorDiscovered: boolean = false;

let upPressed: boolean = false;
let downPressed: boolean = false;
let leftPressed: boolean = false;
let rightPressed: boolean = false;

let highScore: number = 0;
let underBoardText: string = "Din highscore er: " + highScore;
let overBoardText: string = "Find skatten på det gule felt..";

const startingTile: tile | undefined = tiles.find(
  (tile) => tile.isPlayerOnField === true
);
let playerPosition: number[] = [0, 0];
if (startingTile) {
  playerPosition = startingTile.coordinates;
}

let isGameWon: boolean = false;
let newPosition: number[] = playerPosition;
let newTile: tile;
let playerMoved: boolean = false;

//
// Making variables for HTML elements, and putting start elements in them
//
const textOverBoard = document.getElementById("over_board");
const textUnderBoard = document.getElementById("under_board");

if (textOverBoard) {
  textOverBoard.textContent = overBoardText;
}
if (textUnderBoard) {
  textUnderBoard.textContent = underBoardText;
}

//
// RUNNING PROGRAM
//
document.addEventListener("keydown", setupEventListeners); // Setting up eventlistener
updateTiles();
update();

//
// FUNCTIONS
//
function setupEventListeners(e: KeyboardEvent): void {
  overBoardText = "";
  if (e.key === "ArrowUp") {
    upPressed = true;
    console.log("up");
    highScore++;
    underBoardText = "Din highscore er: " + highScore;
    if (textUnderBoard) {
      textUnderBoard.textContent = underBoardText;
    }
  }
  if (e.key === "ArrowDown") {
    downPressed = true;
    console.log("down");
    highScore++;
    underBoardText = "Din highscore er: " + highScore;
    if (textUnderBoard) {
      textUnderBoard.textContent = underBoardText;
    }
  }
  if (e.key === "ArrowLeft") {
    leftPressed = true;
    console.log("left");
    highScore++;
    underBoardText = "Din highscore er: " + highScore;
    if (textUnderBoard) {
      textUnderBoard.textContent = underBoardText;
    }
  }
  if (e.key === "ArrowRight") {
    rightPressed = true;
    console.log("right");
    highScore++;
    underBoardText = "Din highscore er: " + highScore;
    if (textUnderBoard) {
      textUnderBoard.textContent = underBoardText;
    }
  }
}

function updateTiles(): void {
  const canvas: HTMLCanvasElement = document.getElementById(
    "boardCanvas"
  ) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;
  ctx.lineWidth = innerBorderWidth;
  ctx.strokeStyle = backgroundColor;

  if (rows * cols !== tiles.length) {
    console.log("Number og tiles does not match the board!!");
    return;
  }

  let tileIndex = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = getColor(tiles[tileIndex]);
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
      tileIndex++;
    }
  }

  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = backgroundColor;

  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function getColor(tile: tile): string {
  if (tile.isPlayerOnField) return isPlayerOnFieldColor;
  if (tile.tileType === tileType.Door && doorDiscovered) return doorColor;
  if (!tile.isDiscovered) return isNotDiscoveredColor;
  if (tile.tileType === tileType.Monster) return monsterColor;
  if (tile.tileType === tileType.TreasureChest) return treasureChestColor;
  if (tile.tileType === tileType.Rock) return rockColor;
  if (tile.tileType === tileType.Empty) return emptyColor;
  if (tile.tileType === tileType.Sword) return swordColor;
  if (tile.tileType === tileType.Door) return doorColor;
  if (tile.tileType === tileType.Key) return keyColor;
  return whiteColor;
}

async function update() {
  if (isGameOver) {
    document.removeEventListener("keydown", setupEventListeners);
    await waitForAnyKey();
    if (isGameWon) {
      isGameWon = false;
      overBoardText = "Din highscore blev: " + highScore;
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = blackColor;
        await waitForAnyKey();
        document.addEventListener("keydown", setupEventListeners);
      }
    } else {
      overBoardText = "Desværre. Du tabte. Prøv igen!!";
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = blackColor;
        await waitForAnyKey();
        document.addEventListener("keydown", setupEventListeners);
      }
    }
    isGameOver = false;
    if (startingTile) {
      playerPosition = startingTile.coordinates;
    }
    isKeyFound = false;
    isSwordFound = false;
    monsterKilled = false;
    doorOpened = false;
    doorDiscovered = false;
    highScore = 0;
    tiles = JSON.parse(JSON.stringify(startTiles));
    updateTiles();
    if (textOverBoard) {
      textOverBoard.style.color = backgroundColor;
    }
    underBoardText = "Din highscore er: " + highScore;
    if (textUnderBoard) {
      textUnderBoard.textContent = underBoardText;
    }
    await waitForAnyKey();
  }
  underBoardText = "Din highscore er: " + highScore;
  const arrowUpPosition: number[] = [
    playerPosition[0], 
    playerPosition[1] - 1
  ];
  const arrowDownPosition: number[] = [
    playerPosition[0],
    playerPosition[1] + 1,
  ];
  const arrowLeftPosition: number[] = [
    playerPosition[0] - 1,
    playerPosition[1],
  ];
  const arrowRightPosition: number[] = [
    playerPosition[0] + 1,
    playerPosition[1],
  ];
  if (upPressed && IsAbleToMove(arrowUpPosition, tiles, isKeyFound)) {
    movePlayer(tiles, playerPosition, arrowUpPosition);
    newTile = findTileFromCoordinates(tiles, arrowUpPosition);
    upPressed = false;
    playerPosition = arrowUpPosition;
    playerMoved = true;
  }
  else if (downPressed && IsAbleToMove(arrowDownPosition, tiles, isKeyFound)) {
    movePlayer(tiles, playerPosition, arrowDownPosition);
    newTile = findTileFromCoordinates(tiles, arrowDownPosition);
    downPressed = false;
    playerPosition = arrowDownPosition;
    playerMoved = true;
  }
  else if (leftPressed && IsAbleToMove(arrowLeftPosition, tiles, isKeyFound)) {
    movePlayer(tiles, playerPosition, arrowLeftPosition);
    newTile = findTileFromCoordinates(tiles, arrowLeftPosition);
    leftPressed = false;
    playerPosition = arrowLeftPosition;
    playerMoved = true;
  }
  else if (rightPressed && IsAbleToMove(arrowRightPosition, tiles, isKeyFound)) {
    movePlayer(tiles, playerPosition, arrowRightPosition);
    newTile = findTileFromCoordinates(tiles, arrowRightPosition);
    rightPressed = false;
    playerPosition = arrowRightPosition;
    playerMoved = true;
  }
  else {
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
  }
  if (playerMoved) {
    overBoardText = "---";
    if (textOverBoard) {
      textOverBoard.textContent = overBoardText;
      textOverBoard.style.color = backgroundColor;
    }
    if (newTile.tileType === tileType.Key) {
      if (!isKeyFound) {
        overBoardText = "Tillykke, du har fundet nøglen!!";
        if (textOverBoard) {
          textOverBoard.textContent = overBoardText;
          textOverBoard.style.color = keyColor;
        }
        isKeyFound = true;
      }
    }
    if (newTile.tileType === tileType.Sword) {
      if (!isSwordFound) {
        overBoardText = "Tillykke, du har fundet sværdet!!";
        if (textOverBoard) {
          textOverBoard.textContent = overBoardText;
          textOverBoard.style.color = swordColor;
        }
        isSwordFound = true;
      }
    }
    if (newTile.tileType === tileType.TreasureChest) {
      overBoardText = "Tillykke, du har fundet skatten og vundet!!";
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = treasureChestColor;
      }
      isGameWon = true;
      isGameOver = true;
    }
    if (newTile.tileType === tileType.Door && isKeyFound && !doorOpened) {
      overBoardText = "Du har fundet nøglen og åbner døren!!";
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = doorColor;
      }
      doorOpened = true;
    }
    if (
      newTile.tileType === tileType.Monster &&
      isSwordFound &&
      !monsterKilled
    ) {
      overBoardText = "Du dræber monstret med sværdet!!";
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = monsterColor;
      }
      monsterKilled = true;
    }
    if (newTile.tileType === tileType.Monster && !isSwordFound) {
      overBoardText = "Monstret dræber dig!!";
      if (textOverBoard) {
        textOverBoard.textContent = overBoardText;
        textOverBoard.style.color = monsterColor;
      }
      isGameOver = true;
    }
    playerMoved = false;
  }
  requestAnimationFrame(update);
}

function movePlayer(
  tiles: tile[],
  oldPlayerposition: number[],
  newPlayerPosition: number[]
): tile[] {
  tiles = moveFromOldPosition(tiles, oldPlayerposition);
  tiles = moveToNewPosition(tiles, newPlayerPosition);
  updateTiles();
  return tiles;
}

async function waitForAnyKey(): Promise<void> {
  return new Promise((resolve) => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key) {
        window.removeEventListener("keydown", onKeyPress);
        resolve();
      }
    };

    window.addEventListener("keydown", onKeyPress);
  });
}

function IsAbleToMove(
  newPosition: number[],
  tiles: tile[],
  isKeyFound: boolean
): boolean {
  let isAbleToMove: boolean = false;
  if (
    newPosition[0] >= 0 &&
    newPosition[0] <= 4 &&
    newPosition[1] >= 0 &&
    newPosition[1] <= 4
  ) {
    tiles.forEach((tile) => {
      if (tile.coordinates[0] === newPosition[0]) {
        if (tile.coordinates[1] === newPosition[1]) {
          if (tile.tileType !== tileType.Rock) {
            if (tile.tileType === tileType.Door && isKeyFound === false) {
              overBoardText = "Der er en dør, og den er låst";
              if (textOverBoard) {
                textOverBoard.textContent = overBoardText;
                textOverBoard.style.color = doorColor;
              }
              doorDiscovered = true;
              updateTiles();
            } else {
              isAbleToMove = true;
            }
          }
        }
      }
    });
  }
  return isAbleToMove;
}
function moveFromOldPosition(tiles: tile[], position: number[]): tile[] {
  tiles.forEach((tile, index) => {
    if (
      tiles[index].coordinates[0] === position[0] &&
      tiles[index].coordinates[1] === position[1]
    ) {
      tiles[index].isPlayerOnField = false;
      return tiles;
    }
  });
  return tiles;
}
function moveToNewPosition(tiles: tile[], newPosition: number[]): tile[] {
  tiles.forEach((tile, index) => {
    if (
      tiles[index].coordinates[0] === newPosition[0] &&
      tiles[index].coordinates[1] === newPosition[1]
    ) {
      tiles[index].isPlayerOnField = true;
      tiles[index].isDiscovered = true;
      return tiles;
    }
  });
  return tiles;
}
function findTileFromCoordinates(tiles: tile[], position: number[]): tile {
  for (let tile of tiles) {
    if (
      tile.coordinates[0] === position[0] &&
      tile.coordinates[1] === position[1]
    ) {
      return tile;
    }
  }
  console.log("Could not find tile!!");
  return new tile(tileType.Empty, false, false, [0, 0]);
}
