import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Integers } from "../../lib/numerics";

type Card = {
	id: number;
	winning: number[];
	drawn: number[];
}

function parseLine(line: string): Card {
	const [, id, winningPart, drawnPart] = line.match(/Card +(\d+)\: ([\d ]+)\| ([\d ]+)/);
	return {
		id: Number(id),
		winning: winningPart.trim().split(/ +/).map(v => Number(v)),
		drawn: drawnPart.trim().split(/ +/).map(v => Number(v))
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(parseLine).get();

function part1(): number | string {
	const matching = values.map(v => v.winning.filter(k => v.drawn.includes(k)).length);
	const points = matching.map(v => v == 0 ? 0 : Math.pow(2, v - 1));
	return points.sum();
}

function part2(): number | string {
	const stacks = values.map(v => ({...v, count: 1}));
	for(const [i, stack] of stacks.entries()) {
		const matches = stack.winning.filter(v => stack.drawn.includes(v)).length;
		for(const k of Integers.range(i + 1, i + matches)) {
			stacks[k].count += stack.count;
		}
	}
	return stacks.map(v => v.count).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	