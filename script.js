//VIEW

// Opsættelse af størrelse af grid
const numRows = 10;
const numCols = 10;


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

//CONTROLLER

function start() {
    createGrid();
    createModel();
    makeBoardClickable();
}

window.addEventListener("DOMContentLoaded", start)
