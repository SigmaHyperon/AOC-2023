import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists, Matrix } from "../../lib/collections";

type Tile = "." | "#";

const values = Input.readFile().asMatrix("").parse(v => v as Tile).asMatrix();

function expandUniverseVertically(universe: Tile[][]): Tile[][] {
	const result: Tile[][] = [];
	for(const row of universe) {
		result.push([...row]);
		if(row.every(v => v === ".")) {
			result.push([...row]);
		}
	}
	return result;
}

function growUniverse(universe: Matrix<Tile>): Matrix<Tile> {
	const stretchedOnce = expandUniverseVertically(universe.matrix);
	const transposedOnce = stretchedOnce[0].map((_, i) => stretchedOnce.map(row => row[i]));
	const strechedTwice = expandUniverseVertically(transposedOnce);
	return new Matrix(strechedTwice[0].map((_, i) => strechedTwice.map(row => row[i])));
}

function galacticDistance(universe: Matrix<Tile>): number {
	const galaxies = universe.values().filter(v => v.value === "#");
	const pairs = galaxies.flatMap((v, i) => galaxies.slice(i+1).map( w => [v, w] ));
	const distances = pairs.map(v => Math.abs(v[0].x - v[1].x) + Math.abs(v[0].y - v[1].y));
	return distances.sum();
}

function part1(): number | string {
	const grown = growUniverse(values);
	return galacticDistance(grown);
}

function part2(): number | string {
	const startingDistance = galacticDistance(values);
	const grown = growUniverse(values);
	const grownDistance = galacticDistance(grown);
	const offset = grownDistance - startingDistance;
	return startingDistance + offset * 999999;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	