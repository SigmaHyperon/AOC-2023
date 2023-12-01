import { performance } from "perf_hooks";

export default class Solver {
	part1: () => string | number;
	part2: () => string | number;

	protected constructor() {

	}

	static create() {
		return new Solver();
	}

	setPart1(func: () => string | number): Solver {
		this.part1 = func;
		return this;
	}

	setPart2(func: () => string | number): Solver {
		this.part2 = func;
		return this;
	}

	solve() {
		if(this.part1) {

			const solution = this.execute(this.part1);
			console.log("part1:", solution.solution);
			console.log("time:", solution.time);
		}
		if(this.part2) {
			if(this.part1) {
				console.log();
			}
			const solution = this.execute(this.part2);
			console.log("part2:", solution.solution);
			console.log("time:", solution.time);
		}
	}

	protected execute(func: () => string | number): { solution: string, time: number } {
		const t0 = performance.now();
		const solution = func();
		const t1 = performance.now();
		return {
			solution: typeof solution === "number" ? solution.toString() : solution,
			time: t1 - t0
		}
	}
}