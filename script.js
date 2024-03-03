//VIEW

// Opsættelse af størrelse af grid
const numRows = 28;
const numCols = 45;


function makeBoardClickable() {
    document.getElementById('game-container').addEventListener('click', toggleCellState);
}
// Function til at oprette det visuelle grid og elementer i HTML'en
function createGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Fjern tidligere content - rengør siden

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            // Opretter et div element som får information tilsat i form af row og col
            const cell = document.createElement('div');
            cell.className = 'cell dead'; // Opsætter den som død til at starte med
            cell.setAttribute('data-row', i); // Indsætter row og col data - i er row 
            cell.setAttribute('data-col', j); //og j er col
            container.appendChild(cell); //Sammensætter det celle div elementer vi har lavet til den oprindelige game-container
        }
        container.appendChild(document.createElement('br')); // For hver gang vi har lavet den første række af 20
                                                             //elementer hopper vi ud af loopet og tilbage i det 
                                                             //første loop og sætter et linebreak 
    }
}

function toggleCellState(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row')); // Henter row index fra data attribut
    const col = parseInt(cell.getAttribute('data-col'));// Henter col index fra data attribut
    const value = readFromCellModel(row, col)
        if (value === 0) {
            cell.classList.remove('dead');
            cell.classList.add('alive');
            writeToCellModel(row, col, 1);
            console.log('Clicked cell classes:', cell.classList);
        } else if(value === 1) {
            cell.classList.remove('alive');
            cell.classList.add('dead');
            writeToCellModel(row, col, 0)
            console.log('Clicked cell classes:', cell.classList);
        }
}

function updateView() {
    const container = document.getElementById('game-container');

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = container.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            const cellState = readFromCellModel(i, j); // Read the state of the cell from the model
            if (cellState === 1) {
                cell.classList.remove('dead');
                cell.classList.add('alive');
            } else {
                cell.classList.remove('alive');
                cell.classList.add('dead');
            }
        }
    }
}


//MODEL

const model = []

function createModel() {
    for(i = 0; i < numRows; i++) {
        model[i] = []; //lav det første array som holder rows
        for(j = 0; j < numCols; j++) {
            model[i][j] = 0; //Hver celle får nu en værdi som 0, stående for dead - 1 = alive
        }
    }
}

function readFromCellModel(row, col) {
    return model[row][col];
}

function writeToCellModel(row, col, value) {
    model[row][col] = value;
}

function updateModel() {
    const newModel = []; // No need to create a deep copy here
    
    for (let i = 0; i < numRows; i++) {
        newModel[i] = []; // Initialize the inner array
        for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(i, j);
            if (model[i][j] === 1) {
                // Apply rules for live cells
                if (neighbors < 2 || neighbors > 3) {
                    newModel[i][j] = 0; // Cell dies
                } else {
                    newModel[i][j] = 1; // Cell survives
                }
            } else {
                // Apply rules for dead cells
                if (neighbors === 3) {
                    newModel[i][j] = 1; // Cell becomes alive
                } else {
                    newModel[i][j] = 0; // Cell remains dead
                }
            }
        }
    }
    
    // Modify the contents of the existing model array
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            model[i][j] = newModel[i][j];
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;

    // Define offsets for neighboring cells
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    // Iterate over the offsets to check each neighboring cell
    for (const [offsetRow, offsetCol] of offsets) {
        // Calculate the neighbor's row and column indices
        const neighborRow = row + offsetRow;
        const neighborCol = col + offsetCol;

        // Check if the neighbor is within the grid bounds
        if (neighborRow >= 0 && neighborRow < numRows &&
            neighborCol >= 0 && neighborCol < numCols) {
            // Increment count if the neighbor is alive
            if (model[neighborRow][neighborCol] === 1) {
                count++;
            }
        }
    }

    return count;
}


//CONTROLLER

function start() {
    createGrid();
    createModel();
    makeBoardClickable();

    // Add event listeners to buttons
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('clear-btn').addEventListener('click', clearGrid);
    document.getElementById('random-btn').addEventListener('click', setRandomCells);
}

let intervalId;

function startGame() {
    intervalId = setInterval(updateGame, 100)
}

function clearGrid() {
    // Stop the game if it's currently running
    clearInterval(intervalId);
    
    // Clear the model (set all cells to dead)
    createModel();
    
    // Update the view to reflect the cleared grid
    updateView();
}

function setRandomCells() {
    // Stop the game if it's currently running
    clearInterval(intervalId);

    // Clear the model (set all cells to dead)
    createModel();

    // Randomly set 15% of the cells to alive
    const totalCells = numRows * numCols;
    const cellsToSetAlive = Math.floor(totalCells * 0.15);
    for (let i = 0; i < cellsToSetAlive; i++) {
        const randomRow = Math.floor(Math.random() * numRows);
        const randomCol = Math.floor(Math.random() * numCols);
        model[randomRow][randomCol] = 1; // Set the cell to alive
    }

    // Update the view to reflect the random cells
    updateView();
}

function updateGame() {
    updateModel();
    updateView();

}

window.addEventListener("DOMContentLoaded", start)
