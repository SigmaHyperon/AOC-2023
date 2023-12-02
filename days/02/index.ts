import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

type Turn = {[key in "red" | "green" | "blue"]?: number};

interface Game {
	id: number;
	turns: Turn[];
}

function isValidColor(color: string): color is "red" | "green" | "blue" {
	return ["red", "green", "blue"].includes(color);
}

function parse(line: string): Game {
	const [_1, _2] = line.split(":");
	const id = Number(_1.match(/Game (\d+)/)[1]);
	const game: Game = {
		id: id,
		turns: []
	};
	const turns = _2.split(";");
	for(const turn of turns) {
		const draws = turn.split(", ");
		const t: Turn = {}
		for(const draw of draws) {
			const [num, color] = draw.trim().split(" ");
			if(isValidColor(color) && !isNaN(Number(num))) {
				t[color] = Number(num);
			} else {
				console.log(num, color);
				throw "error";
			}
 		}
		game.turns.push(t);
	}
	return game;
}

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();

function part1(): number | string {
	const threshold = {
		red: 12,
		green: 13,
		blue: 14
	}
	let sum = 0;
	top: for(const game of values) {
		for(const turn of game.turns) {
			for(const draw of Object.entries(turn)) {
				if(draw[1] > threshold[draw[0]]) {
					continue top;
				}
			}
		}
		sum += game.id;
	}
	return sum;
}

function part2(): number | string {
	let sum = 0;
	for(const game of values) {
		const max: Turn = {};
		for(const color of ["red", "green", "blue"]) {
			max[color] = Math.max(...game.turns.map(v => v[color]).map(v => Number(v)).filter(v => !isNaN(v)));
		}
		if(Object.keys(max).length === 3) {
			sum += max.red * max.green * max.blue;
		}
	}
	return sum;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	