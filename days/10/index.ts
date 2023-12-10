import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";
import { MatrixValue } from "../../lib/collections";

type TileType = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";
type Direction = "up" | "down" | "left" | "right";

function isTile(s: string): s is TileType {
	return ["|", "-", "L", "J", "7", "F", ".", "S"].includes(s);
}

const values = Input.readFile().asMatrix("").parse(v => isTile(v) ? v as TileType : "." ).asMatrix();

function directions(type: TileType): Direction[] {
	switch(type) {
		case "|": return ["up", "down"];
		case "-": return ["left", "right"];
		case "L": return ["up", "right"];
		case "J": return ["up", "left"];
		case "7": return ["down", "left"];
		case "F": return ["down", "right"];
		case ".": return [];
		case "S": return ["up", "down", "left", "right"];
	}
}

function directionOf(a: Point2, b: Point2): Direction {
	if ((a.x !== b.x && a.y !== b.y) || (a.x === b.x && a.y === b.y)) {
		return null;
	} else if (a.x !== b.x) {
		return a.x < b.x ? "right" : "left";
	} else if (a.y !== b.y) {
		return a.y < b.y ? "down" : "up";
	} else {
		return null;
	}
}

function isConnected(a: MatrixValue<TileType>, b: MatrixValue<TileType>): boolean {
	if(Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1 || (a.x !== b.x && a.y !== b.y)) {
		return false;
	}
	const aPotential = directions(a.value);
	const bPotential = directions(b.value);
	return aPotential.includes(directionOf(a, b)) && bPotential.includes(directionOf(b, a));
}

function part1(): number | string {
	const starts = values.values().filter(v => v.value === "S");
	if(starts.length !== 1) {
		throw "invalid amount of start locations: " + starts.length;
	}
	const start = starts[0];
	let current = [start];
	const visited: MatrixValue<TileType>[] = [start];
	let steps = 0;
	do {
		const connectedNeighbours = current.flatMap(v => values.neighbours(v.x, v.y).filter(k => isConnected(v, k)));
		const next = connectedNeighbours.filter(v => visited.findIndex(k => k.x == v.x && k.y == v.y) == -1);
		visited.push(...next);
		current = next;
		steps++;
	} while(current.length > 1)
	return steps - 1;
}

function inside(point: Point2, vertexes: Point2[]): boolean {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
	const {x, y} = point;
    
    var inside = false;
    for (var i = 0, j = vertexes.length - 1; i < vertexes.length; j = i++) {
        var xi = vertexes[i].x, yi = vertexes[i].y;
        var xj = vertexes[j].x, yj = vertexes[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function part2(): number | string {
	const starts = values.values().filter(v => v.value === "S");
	if(starts.length !== 1) {
		throw "invalid amount of start locations: " + starts.length;
	}
	const start = starts[0];
	let current = [start];
	const visited: MatrixValue<TileType>[] = [start];
	let steps = 0;
	do {
		const connectedNeighbours = current.flatMap(v => values.neighbours(v.x, v.y).filter(k => isConnected(v, k)));
		const next = connectedNeighbours.filter(v => visited.findIndex(k => k.x == v.x && k.y == v.y) == -1).slice(0, 1);
		visited.push(...next);
		current = next;
		steps++;
	} while(current.length > 0)

	const notLoopTiles = values.values().filter(v => visited.findIndex(k => k.x == v.x && k.y == v.y) == -1);
	return notLoopTiles.filter(v => inside(v, visited)).length;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	