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
			console.log("time:", formatDuration(solution.time));
		}
		if(this.part2) {
			if(this.part1) {
				console.log();
			}
			const solution = this.execute(this.part2);
			console.log("part2:", solution.solution);
			console.log("time:", formatDuration(solution.time));
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

function formatDuration(time: number): string {
	if (time < 0) time = -time;
	const t = {
	  day: Math.floor(time / 86400000),
	  hour: Math.floor(time / 3600000) % 24,
	  minute: Math.floor(time / 60000) % 60,
	  second: Math.floor(time / 1000) % 60,
	  millisecond: Math.floor(time) % 1000,
	  microsecond: Math.floor((time % 1) * 1000),
	  nanosecond: Math.floor((time * 1000000) % 1000)
	};
	return Object.entries(t)
	  .filter(val => val[1] !== 0)
	  .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
	  .join(', ');
};