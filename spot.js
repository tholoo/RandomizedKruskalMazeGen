class Spot {
    constructor(i, j, cell) {
        this.i = i;
        this.j = j;
        // this.x = i * cell_size;
        // this.y = j * cell_size;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous;
        this.cell = cell;
        this.x = cell.x;
        this.y = cell.y;
        this.isWall = false;
        this.middle = createVector(cell.middle.x, cell.middle.y);
    }
    addNeighbors() {
        if (this.i > 0) {
            const neighbor = AGrid[this.i - 1][this.j]; //* Left
            this.neighbors.push(neighbor);
        }
        if (this.i < cols - 1) {
            const neighbor = AGrid[this.i + 1][this.j]; //* Right
            this.neighbors.push(neighbor);
        }
        if (this.j > 0) {
            const neighbor = AGrid[this.i][this.j - 1]; //* Top
            this.neighbors.push(neighbor);
        }
        if (this.j < rows - 1) {
            const neighbor = AGrid[this.i][this.j + 1]; //* Down
            this.neighbors.push(neighbor);
        }
        // this.neighbors.push(this.cell.getFreeNeighbors());
        // for (let i = -1; i < 2; i++) {
        // 	for (let j = -1; j < 2; j++) {
        // 		const x = this.i + i;
        // 		const y = this.j + j;
        // 		if (x >= 0 && x <= cols - 1 && y >= 0 && y <= rows - 1) {
        // 			const cell = AGrid[x][y];
        // 			if (cell !== this) {
        // 				this.neighbors.push(cell);
        // 			}
        // 		}
        // 	}
        // }
    }
    heuristic() {
        const d = dist(this.i, this.j, end.i, end.j);
        // const d = abs(this.i - end.i) + abs(this.j - end.j);
        this.g = d;
    }
    updateScores(newG, prev) {
        this.g = newG;
        this.heuristic();
        this.f = this.h + this.g;
        this.previous = prev;
    }
    show(c, r = false) {
        if (c) {
            // stroke(0);
            fill(c);
        } else {
            stroke(50, 100);
            fill(150);
            return;
        }

        if (r) {
            rect(this.x, this.y, CELL_SIZE);
        } else {
            ellipse(this.middle.x, this.middle.y, (CELL_SIZE * 2) / 3);
        }
    }
}