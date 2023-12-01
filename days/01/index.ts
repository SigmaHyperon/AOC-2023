import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const values = Input.readFile().asLines().removeEmpty().get();

function part1(): number | string {
	return values.map(v => v.replace(/\D/g, ""))
	.map(v => Number(`${v[0]}${v[v.length - 1]}`))
	.sum();
}

const numbers = [
	{
		text: "one",
		replacement: "on1e"
	},
	{
		text: "two",
		replacement: "tw2o"
	},
	{
		text: "three",
		replacement: "thr3ee"
	},
	{
		text: "four",
		replacement: "fo4ur"
	},
	{
		text: "five",
		replacement: "fi5ve"
	},
	{
		text: "six",
		replacement: "si6x"
	},
	{
		text: "seven",
		replacement: "sev7en"
	},
	{
		text: "eight",
		replacement: "eig8ht"
	},
	{
		text: "nine",
		replacement: "ni9ne"
	}
]

function part2(): number | string {
	return values.map(v => {
		for(let x of numbers) {
			v = v.replaceAll(x.text, x.replacement);
		}
		return v;
	})
	.map(v => v.replace(/\D/g, ""))
	.map(v => Number(`${v[0]}${v[v.length - 1]}`))
	.sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	