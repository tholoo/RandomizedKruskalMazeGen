p5.disableFriendlyErrors = true;
let maze_generated;
let initilized;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    cell_size = min(window.innerWidth, window.innerHeight) / 40;
    rows = Math.floor(height / cell_size);
    cols = Math.floor(width / cell_size);
    reset();
}

function reset() {
    generate_maze();
    maze_generated = false;
    initilized = false;
}

function draw() {
    background(15, 35, 35);
    if (!maze_generated) {
        for (let i = 0; i < 50; i++) {
            step();
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
    if (maze_generated) {
        if (!initilized) initilize();
        for (let i = 0; i < 5; i++) {
            A_step();
        }
    }
}

function generate_maze() {
    grid = [];
    set = [];
    cells = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        set[i] = [];
        for (let j = 0; j < rows; j++) {
            const cell = new Cell(i, j, cell_size);
            grid[i][j] = cell;
            set[i][j] = i + j * cols;
            cells.push(cell);
        }
    }
}

function step() {
    if (cells.length > 0) {
        const randInd = floor(random(cells.length));
        let done = cells[randInd].randomWall();
        if (done === undefined) cells.splice(randInd, 1);
    } else {
        maze_generated = true;
    }
}

function initilize() {
    initilized = true;
    AGrid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        AGrid[i] = new Array(rows);
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            AGrid[i][j] = new Spot(i, j, grid[i][j]);
        }
    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            AGrid[i][j].addNeighbors();
        }
    }

    start = AGrid[0][0];
    end = AGrid[cols - 1][rows - 1];

    openSet = [start];
    closedSet = [];
    optimal_path = [];

    found_end = false;
}

function A_step() {
    if (openSet.length > 0) {
        let lowest = 0;
        for (let i = 0; i < openSet.length; i++) {
            const spot = openSet[i];
            if (spot.f < openSet[lowest].f) {
                lowest = i;
            }
        }
        const lowestI = lowest;
        lowest = openSet[lowest];

        if (!found_end) {
            optimal_path = [];
            let prev = lowest.previous;
            optimal_path.push(lowest);
            while (prev) {
                optimal_path.push(prev);
                prev = prev.previous;
            }
        }

        if (lowest === end) {
            // console.log('Done:', str(optimal_path.length), 'Cells');
            // noLoop();
            found_end = true;
            setTimeout(reset, 1000)
        }

        removeFromArray(openSet, lowestI);
        closedSet.push(lowest);
        if (lowest.neighbors.length > 0) {
            for (const neighbor of lowest.neighbors) {
                if (!closedSet.includes(neighbor) &&
                    neighbor.cell.canGo(lowest.cell)
                ) {
                    let theG = lowest.g + 1;
                    if (openSet.includes(neighbor)) {
                        if (theG < neighbor.g) {
                            neighbor.updateScores(theG, lowest);
                        }
                    } else {
                        neighbor.updateScores(theG, lowest);
                        openSet.push(neighbor);
                    }
                }
            }
        }
        // openSet = newOpenSet;
        // newOpenSet = [];
    }
    push();
    noFill();
    strokeWeight(cell_size / 3);
    stroke(175, 175, 220);
    beginShape();
    for (let spot of optimal_path) {
        vertex(spot.middle.x, spot.middle.y);
    }
    endShape();
    pop();
}

function removeFromArray(arr, index) {
    if (index >= 0) arr.splice(index, 1);
}