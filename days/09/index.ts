import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const values = Input.readFile().asLines().removeEmpty().parse(v => v.split(" ").map(v => Number(v))).get();

function calculateDifferences(numbers: number[]): number[] {
	const differences: number[] = [];

  for (let i = 1; i < numbers.length; i++) {
    const difference = numbers[i] - numbers[i - 1];
    differences.push(difference);
  }

  return differences;
}

function calculateDifferenceStack(numbers: number[]): number[][] {
	const stack: number[][] = [numbers];
	while(stack[stack.length - 1].some(v => v !== 0)) {
		stack.push(calculateDifferences(stack[stack.length - 1]));
	}
	return stack;
}

function predictNextValue(stack: number[][]): number {
	const lastValues = stack.map(v => v[v.length - 1]).reverse();
	const nextValues: number[] = [];
	for(const [index, value] of lastValues.entries()) {
		if(index === 0) {
			nextValues.push(0);
		} else {
			nextValues.push(value + nextValues[index - 1]);
		}
	}
	return nextValues[nextValues.length - 1];
}


function part1(): number | string {
	const stacks = values.map(v => calculateDifferenceStack(v));
	const nextNumbers = stacks.map(v => predictNextValue(v));
	return nextNumbers.sum();
}

function predictPreviousValue(stack: number[][]): number {
	const firstValues = stack.map(v => v[0]).reverse();
	const nextValues: number[] = [];
	for(const [index, value] of firstValues.entries()) {
		if(index === 0) {
			nextValues.push(0);
		} else {
			nextValues.push(value - nextValues[index - 1]);
		}
	}
	return nextValues[nextValues.length - 1];
}

function part2(): number | string {
	const stacks = values.map(v => calculateDifferenceStack(v));
	const previousNumbers = stacks.map(v => predictPreviousValue(v));
	return previousNumbers.sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	