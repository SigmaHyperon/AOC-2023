import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix } from "../../lib/collections";
import { Point2 } from "../../lib/geometry";
import { Integers } from "../../lib/numerics";

const values = Input.readFile().asMatrix("").asMatrix();

type Location = {x1: number, x2: number, y: number};

type LocationValue = Location & { value: number };

function findNumbers(matrix: Matrix<string>): Location[] {
	let numberLocations: Location[] = [];
	let x1 = -1;
	for(const [y, line] of matrix.matrix.entries()) {
		for(const [x, char] of line.entries()) {
			if(!isNaN(Number(char))) {
				if(x1 === -1) {
					x1 = x;
					continue;
				}
			} else if(x1 !== -1) {
				numberLocations.push({x1: x1, x2: x - 1, y: y});
				x1 = -1;
			}
		}
		if(x1 !== -1) {
			numberLocations.push({x1: x1, x2: line.length - 1, y: y});
			x1 = -1;
		}
	}
	return numberLocations;
}

function isPartNumberLocation(location: Location, matrix: Matrix<string>) {
	return Integers.range(location.x1, location.x2).flatMap(v => matrix.neighbours(v, location.y, true)).some(v => !"0123456789.".includes(v.value));
}

function getNumberAtLocation(location: Location, matrix: Matrix<string>): number {
	return Number(Integers.range(location.x1, location.x2).map(v => matrix.valueAt(v, location.y)).join(""));
}

function getLocationValue(location: Location, matrix: Matrix<string>): LocationValue {
	return {
		x1: location.x1,
		x2: location.x2,
		y: location.y,
		value: getNumberAtLocation(location, matrix)
	}
}


const locations = findNumbers(values);
const partNumberLocations = locations.filter(v => isPartNumberLocation(v, values));
const partNumbers = partNumberLocations.map(v => getLocationValue(v, values));

function part1(): number | string {
	return partNumbers.map(v => v.value).sum();
}

type GearValue = {point: Point2, numbers: LocationValue[]}

function findGears(matrix: Matrix<string>): GearValue[] {
	return matrix.values().filter(v => v.value === "*").map(v => {
		const point = new Point2(v.x, v.y)
		return {
			point,
			numbers: partNumbers.filter(lv => isPointNearLocation(point, lv, matrix))
		};
	}).filter(v => v.numbers.length === 2);
}

function isPointNearLocation(point: Point2, location: Location, matrix: Matrix<string>): boolean {
	return point.isInRect(location.x1 - 1, location.y - 1, location.x2 + 1, location.y + 1);
}

function part2(): number | string {
	const gears = findGears(values);
	return gears.map(v => v.numbers[0].value * v.numbers[1].value).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	