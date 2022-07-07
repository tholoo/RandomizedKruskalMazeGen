class Cell {
	constructor(i, j, s) {
		this.i = i;
		this.j = j;
		this.x = i * s;
		this.y = j * s;
		this.s = s - 2.4;
		this.walls = [true, true, true, true]; //* LEFT - DOWN - RIGHT - UP
		this.nWalls = 4;
		this.middle = new p5.Vector(
			this.x + this.s / 2,
			this.y + this.s / 2
		);
	}
	getNeighbors(walls) {
		const Inds = [
			[-1, 0],
			[0, 1],
			[1, 0],
			[0, -1],
		];
		let neighbors = [];
		for (let ind of walls) {
			const neighbor =
				grid[this.i + Inds[ind][0]][this.j + Inds[ind][1]];
			neighbors.push(neighbor);
		}
		return neighbors;
	}
	randomWall() {
		if (this.nWalls === 0) return;
		let walls = [];
		for (let i = 0; i < this.walls.length; i++) {
			const wall = this.walls[i];
			if (wall) {
				let canPush = false;
				if (i === 0 && this.i > 0) canPush = true;
				if (i === 1 && this.j < rows - 1) canPush = true;
				if (i === 2 && this.i < cols - 1) canPush = true;
				if (i === 3 && this.j > 0) canPush = true;
				if (canPush) walls.push(i);
			}
		}
		const neighbors = this.getNeighbors(walls);

		let freeNeighbor = false;
		for (let neighbor of neighbors) {
			if (!this.sameSet(neighbor)) {
				freeNeighbor = true;
				break;
			}
		}
		if (!freeNeighbor) return;

		const Inds = [
			[-1, 0],
			[0, 1],
			[1, 0],
			[0, -1],
		];

		const rWall = random(walls);
		const nWall = (rWall + 2) % this.walls.length;

		const rInd = Inds[rWall];
		const neighbor = grid[this.i + rInd[0]][this.j + rInd[1]];

		if (!this.sameSet(neighbor)) {
			this.walls[rWall] = false;
			neighbor.walls[nWall] = false;
			this.nWalls--;
			neighbor.nWalls--;

			const n = set[neighbor.i][neighbor.j];
			const thisN = set[this.i][this.j];
			set[this.i][this.j] = n;
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					if (set[i][j] === thisN) {
						set[i][j] = n;
					}
				}
			}
		}
		return this;
	}
	sameSet(neighbor) {
		return set[this.i][this.j] === set[neighbor.i][neighbor.j];
	}
	getFreeNeighbors() {
		let walls = [];
		for (let i = 0; i < this.walls.length; i++) {
			const wall = this.walls[i];
			if (!wall) walls.push(i);
		}
		return this.getNeighbors(walls);
	}
	canGo(cell) {
		let neighbors = this.getFreeNeighbors();
		for (let neighbor of neighbors) {
			if (neighbor === cell) return true;
		}
		return false;
	}
	show() {
		stroke(150, 50, 120);
		if (this.nWalls === 4) {
			strokeWeight(1.5);
			fill(150, 50, 120, 50);
			rect(this.x, this.y, this.s);
			return;
		}
		strokeWeight(3);
		if (this.walls[0]) {
			line(this.x, this.y, this.x, this.y + this.s);
		}
		if (this.walls[1]) {
			line(
				this.x,
				this.y + this.s,
				this.x + this.s,
				this.y + this.s
			);
		}
		if (this.walls[2]) {
			line(
				this.x + this.s,
				this.y + this.s,
				this.x + this.s,
				this.y
			);
		}
		if (this.walls[3]) {
			line(this.x + this.s, this.y, this.x, this.y);
		}
	}
}
