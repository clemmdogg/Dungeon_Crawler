// Get the canvas element and set its context
const canvas: HTMLCanvasElement = document.getElementById('boardCanvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

enum tileType
        {
            Empty,
            Rock,
            Door,
            Monster,
            Key,
            Sword,
            TreasureChest
        }

class Tile {
    tileType: tileType;
    isPlayerOnField: boolean;
    isDiscovered: boolean;
    int[]
        
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// Define board size
const rows: number = 5;
const cols: number = 5;
const blockSize: number = 130; // Size of each block in pixels
const borderWidth: number = 0; // Outer border width
const innerBorderWidth: number = 7; // Inner border width between blocks

// Set canvas size based on the board size
canvas.width = cols * blockSize;
canvas.height = rows * blockSize;

// Function to draw the grid of 2D blocks
function drawBoard(): void {
    // Now, set the line width for inner borders between blocks
    ctx.lineWidth = innerBorderWidth; // Thinner inner borders
    ctx.strokeStyle = '#E5E4E2'; // Same color for inner borders (optional)

    // Loop through each block and draw them with inner borders
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Set a random color for each block (optional)
            ctx.fillStyle = '#B2BEB5';
            // Draw each block as a filled rectangle
            ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            // Draw the border around each block with the specified inner width
            ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
    }
    // First, set the line width for the outer border
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#E5E4E2'; // Black color for outer border

    // Draw the outer border around the entire grid
    // Adjust the outer border position to account for the lineWidth
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Function to generate a random color for the blocks
function getRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Draw the board
drawBoard();