import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

type Conversion<T> = {
	source: T,
	destination: T
};

type ConversionRange = Conversion<number> & { range: number};
type ConversionSet = {
	type: Conversion<string>;
	ranges: ConversionRange[]
}

function parse(input: string): { seeds: number[], maps: ConversionSet[] } {
	const [seedDefinition, ...maps] = input.split("\n\n");
	return {
		seeds: seedDefinition.split(" ").slice(1).map(v => Number(v)),
		maps: maps.map(v => parseMap(v.trim()))
	};
}

function parseMap(input: string): ConversionSet {
	const [typeDefinition, ...ranges] = input.split("\n");
	const [, source, destination] = typeDefinition.match(/(\w+)-to-(\w+)/);
	return {
		type: {source, destination},
		ranges: ranges.map(v => parseRule(v))
	}
}

function parseRule(input: string): ConversionRange {
	const numbers = input.split(" ").map(k => Number(k));
	return {
		destination: numbers[0],
		source: numbers[1],
		range: numbers[2]
	};
}

const values = parse(Input.readFile().get());

function getConversionSet(source: string): ConversionSet {
	const set = values.maps.find(v => v.type.source === source);
	if(typeof set === "undefined") {
		throw `could not find conversion set with source ${source}`;
	}
	return set;
}

function processSeed(seed: number): number {
	let type = "seed";
	let value = seed;
	while(type != "location") {
		const conversionSet = getConversionSet(type);
		type = conversionSet.type.destination;
		for(const rule of conversionSet.ranges) {
			if(fitsConversionRule(value, rule)) {
				const offset = value - rule.source;
				value = rule.destination + offset;
				break;
			}
		}
	}
	return value;
}

function fitsConversionRule(value: number, range: ConversionRange): boolean {
	return value >= range.source && value <= range.source + range.range - 1;
}

function part1(): number | string {
	const locations = values.seeds.map(v => processSeed(v));
	return Math.min(...locations);
}

function isValidSeed(seed: number, ranges: number[][]): boolean {
	return ranges.some(v => seed >= v[0] && seed <= v[0] + v[1] - 1);
}

function part2(): number | string {
	const seedRanges = values.seeds.flatMap((_, i, a) => i % 2 ? [] : [a.slice(i, i + 2)]);
	const minSeed = Math.min(...seedRanges.map(v => v[0]));
	const maxSeed = Math.max(...seedRanges.map(v => v[0] + v[1] - 1));
	let min = Infinity;
	for(let seed = minSeed; seed <= maxSeed; seed++) {
		if(isValidSeed(seed, seedRanges)) {
			const location = processSeed(seed);
			if(location < min) {
				min = location;
			}
		}
	}
	return min;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	