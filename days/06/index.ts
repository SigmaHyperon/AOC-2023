import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

function parse(lines: string[]): {time: number, distance: number}[] {
	const [, ...times] = lines[0].split(/ +/).map(v => Number(v));
	const [, ...distances] = lines[1].split(/ +/).map(v => Number(v));
	return times.map((e, i) => ({time: e, distance: distances[i]}));
}

function parse2(lines: string[]): {time: number, distance: number} {
	const time = Number(lines[0].replaceAll(/\D/g, ""));
	const distance = Number(lines[1].replaceAll(/\D/g, ""));
	return {time, distance};
}

const values = parse(Input.readFile().asLines().removeEmpty().get());
const values2 = parse2(Input.readFile().asLines().removeEmpty().get());

function performRace(hold: number, time: number): number {
	return hold * (time - hold);
}

function analyzeRace(time: number, distance: number): number {
	let min = null;
	for(let i = 1; i < time; i++) {
		const achievedDistance = performRace(i, time);
		if(achievedDistance > distance) {
			min = i;
			break;
		}
	}
	if(min !== null) {
		let max = null;
		for(let i = time - 1; i > 0; i--) {
			const achievedDistance = performRace(i, time);
			if(achievedDistance > distance) {
				max = i;
				break;
			}
		}
		return max - min + 1;
	}
}

function part1(): number | string {
	const wins = values.map(v => analyzeRace(v.time, v.distance));
	return wins.product();
}

function part2(): number | string {
	const wins = analyzeRace(values2.time, values2.distance);
	return wins;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	