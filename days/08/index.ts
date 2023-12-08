import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Integers } from "../../lib/numerics";

type Node = {
	name: string;
	left: string;
	right: string;
}

function parseNode(line: string): Node {
	const [, name, left, right] = line.match(/(\w+) = \((\w+), (\w+)\)/);
	return {name, left, right};
}

const values = Input.readFile().get();

const [instructions, nodeDefinitions] = values.split("\n\n");

const nodes = new Map(Input.import(nodeDefinitions).asLines().removeEmpty().parse(parseNode).get().map(v => [v.name, v] as [string, Node]));

function run(start: string, end: string): number {
	let current = start;
	let ip = 0;
	while(!current.endsWith(end)) {
		const instruction = instructions[ip % instructions.length];
		if(instruction === "L") {
			current = nodes.get(current).left;
		} else {
			current = nodes.get(current).right;
		}
		ip++
	}
	return ip;
}

function part1(): number | string {
	return run("AAA", "ZZZ");
}

function part2(): number | string {
	const start = [...nodes.keys()].filter(v => v.endsWith("A"));
	const loopLengths = start.map(v => run(v, "Z"));
	return Integers.lcm(...loopLengths);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	