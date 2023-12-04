import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { range } from "../../lib/util";

type Card = {
	id: number;
	winning: number[];
	drawn: number[];
}

type CardStack = Card & {count: number};

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
	const stacks = values.map(v => { return {...v, count: 1} as CardStack });
	for(const [i, stack] of Object.entries(stacks)) {
		const index = Number(i);
		const matches = stack.winning.filter(v => stack.drawn.includes(v)).length;
		for(const k of range(index + 1, index + matches)) {
			stacks[k].count += stack.count;
		}
	}
	return stacks.map(v => v.count).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	