"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//
// Settings for tile enum and tile class
//
var tileType;
(function (tileType) {
    tileType[tileType["Empty"] = 0] = "Empty";
    tileType[tileType["Rock"] = 1] = "Rock";
    tileType[tileType["Door"] = 2] = "Door";
    tileType[tileType["Monster"] = 3] = "Monster";
    tileType[tileType["Key"] = 4] = "Key";
    tileType[tileType["Sword"] = 5] = "Sword";
    tileType[tileType["TreasureChest"] = 6] = "TreasureChest";
})(tileType || (tileType = {}));
class tile {
    constructor(tileType, isPlayerOnField, isDiscovered, coordinates) {
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
const rows = 5;
const cols = 5;
const tileSize = 130;
const borderWidth = 0;
const innerBorderWidth = 7;
// Setting up the tiles for the maze
const startTiles = [
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
const backgroundColor = "#e5e4e2";
const isNotDiscoveredColor = "#818181";
const isPlayerOnFieldColor = "#01ae55";
const monsterColor = "#ae0148";
const rockColor = "#5b5b5b";
const emptyColor = "#c8c8c8";
const swordColor = "#5355f7";
const doorColor = "#5e03c4";
const keyColor = "#03c4b5";
const treasureChestColor = "#f5f51e";
const blackColor = "#000000";
const whiteColor = "#ffffff";
//
// Assigning the variables to the start values
//
let tiles = JSON.parse(JSON.stringify(startTiles)); // Stringify to make tiles modifyable without modifying startTiles
let isKeyFound = false;
let isSwordFound = false;
let isGameOver = false;
let monsterKilled = false;
let doorOpened = false;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let highScore = 0;
let underBoardText = "Din highscore er: " + highScore;
let overBoardText = "Find skatten på det gule felt..";
const startingTile = tiles.find((tile) => tile.isPlayerOnField === true);
let playerPosition = [0, 0];
if (startingTile) {
    playerPosition = startingTile.coordinates;
}
let isGameWon = false;
let newPosition = playerPosition;
let newTile;
let playerMoved = false;
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
function setupEventListeners(e) {
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
function updateTiles() {
    const canvas = document.getElementById("boardCanvas");
    const ctx = canvas.getContext("2d");
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
function getColor(tile) {
    if (!tile.isDiscovered)
        return isNotDiscoveredColor;
    if (tile.isPlayerOnField)
        return isPlayerOnFieldColor;
    if (tile.tileType === tileType.Monster)
        return monsterColor;
    if (tile.tileType === tileType.TreasureChest)
        return treasureChestColor;
    if (tile.tileType === tileType.Rock)
        return rockColor;
    if (tile.tileType === tileType.Empty)
        return emptyColor;
    if (tile.tileType === tileType.Sword)
        return swordColor;
    if (tile.tileType === tileType.Door)
        return doorColor;
    if (tile.tileType === tileType.Key)
        return keyColor;
    return whiteColor;
}
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isGameOver) {
            document.removeEventListener("keydown", setupEventListeners);
            yield waitForAnyKey();
            if (isGameWon) {
                isGameWon = false;
                overBoardText = "Din highscore blev: " + highScore;
                if (textOverBoard) {
                    textOverBoard.textContent = overBoardText;
                    textOverBoard.style.color = blackColor;
                    yield waitForAnyKey();
                    document.addEventListener("keydown", setupEventListeners);
                }
            }
            else {
                overBoardText = "Desværre. Du tabte. Prøv igen!!";
                if (textOverBoard) {
                    textOverBoard.textContent = overBoardText;
                    textOverBoard.style.color = blackColor;
                    yield waitForAnyKey();
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
            yield waitForAnyKey();
        }
        underBoardText = "Din highscore er: " + highScore;
        const arrowUpPosition = [playerPosition[0], playerPosition[1] - 1];
        const arrowDownPosition = [
            playerPosition[0],
            playerPosition[1] + 1,
        ];
        const arrowLeftPosition = [
            playerPosition[0] - 1,
            playerPosition[1],
        ];
        const arrowRightPosition = [
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
        if (downPressed && IsAbleToMove(arrowDownPosition, tiles, isKeyFound)) {
            movePlayer(tiles, playerPosition, arrowDownPosition);
            newTile = findTileFromCoordinates(tiles, arrowDownPosition);
            downPressed = false;
            playerPosition = arrowDownPosition;
            playerMoved = true;
        }
        if (leftPressed && IsAbleToMove(arrowLeftPosition, tiles, isKeyFound)) {
            movePlayer(tiles, playerPosition, arrowLeftPosition);
            newTile = findTileFromCoordinates(tiles, arrowLeftPosition);
            leftPressed = false;
            playerPosition = arrowLeftPosition;
            playerMoved = true;
        }
        if (rightPressed && IsAbleToMove(arrowRightPosition, tiles, isKeyFound)) {
            movePlayer(tiles, playerPosition, arrowRightPosition);
            newTile = findTileFromCoordinates(tiles, arrowRightPosition);
            rightPressed = false;
            playerPosition = arrowRightPosition;
            playerMoved = true;
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
            if (newTile.tileType === tileType.Monster &&
                isSwordFound &&
                !monsterKilled) {
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
    });
}
function movePlayer(tiles, oldPlayerposition, newPlayerPosition) {
    tiles = moveFromOldPosition(tiles, oldPlayerposition);
    tiles = moveToNewPosition(tiles, newPlayerPosition);
    updateTiles();
    return tiles;
}
function waitForAnyKey() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const onKeyPress = (event) => {
                if (event.key) {
                    window.removeEventListener("keydown", onKeyPress);
                    resolve();
                }
            };
            window.addEventListener("keydown", onKeyPress);
        });
    });
}
function IsAbleToMove(newPosition, tiles, isKeyFound) {
    let isAbleToMove = false;
    if (newPosition[0] >= 0 &&
        newPosition[0] <= 4 &&
        newPosition[1] >= 0 &&
        newPosition[1] <= 4) {
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
                        }
                        else {
                            isAbleToMove = true;
                        }
                    }
                }
            }
        });
    }
    return isAbleToMove;
}
function moveFromOldPosition(tiles, position) {
    tiles.forEach((tile, index) => {
        if (tiles[index].coordinates[0] === position[0] &&
            tiles[index].coordinates[1] === position[1]) {
            tiles[index].isPlayerOnField = false;
            return tiles;
        }
    });
    return tiles;
}
function moveToNewPosition(tiles, newPosition) {
    tiles.forEach((tile, index) => {
        if (tiles[index].coordinates[0] === newPosition[0] &&
            tiles[index].coordinates[1] === newPosition[1]) {
            tiles[index].isPlayerOnField = true;
            tiles[index].isDiscovered = true;
            return tiles;
        }
    });
    return tiles;
}
function findTileFromCoordinates(tiles, position) {
    for (let tile of tiles) {
        if (tile.coordinates[0] === position[0] &&
            tile.coordinates[1] === position[1]) {
            return tile;
        }
    }
    console.log("Could not find tile!!");
    return new tile(tileType.Empty, false, false, [0, 0]);
}
