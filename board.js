// Get the canvas element and set its context
var canvas = document.getElementById('boardCanvas');
var ctx = canvas.getContext('2d');
// Define board size
var rows = 5;
var cols = 5;
var blockSize = 130; // Size of each block in pixels
var borderWidth = 0; // Outer border width
var innerBorderWidth = 7; // Inner border width between blocks
// Set canvas size based on the board size
canvas.width = cols * blockSize;
canvas.height = rows * blockSize;
// Function to draw the grid of 2D blocks
function drawBoard() {
    // Now, set the line width for inner borders between blocks
    ctx.lineWidth = innerBorderWidth; // Thinner inner borders
    ctx.strokeStyle = '#E5E4E2'; // Same color for inner borders (optional)
    // Loop through each block and draw them with inner borders
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
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
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// Draw the board
drawBoard();
