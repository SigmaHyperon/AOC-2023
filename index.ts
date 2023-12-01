import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import path from "path";
import Constants from "./lib/constants";
import fs from "fs";
import { env } from "process";
import { exec } from "child_process";

yargs(hideBin(process.argv))
.option("day", {
	alias: "d",
	type: "number"
})
.command("*", false, () => {}, (args) => {
	if(!(args instanceof Promise)) {
		import(`./days/${formatDay(args.day)}`);
	}
})
.command("init", "initialize day", () => {}, (args) => {
	if(!(args instanceof Promise)) {
		createCodeFile(args.day)
	}
})
.argv;

function formatDay(day: number): string {
	return day.toString().padStart(2, "0");
}

function createCodeFile(day: number) {
	const content = `
		import { Input } from "../../lib/input";
		import Solver from "../../lib/solver";
		import "../../lib/prototypes";

		const values = Input.readFile().get();

		function part1(): number | string {
			return 0;
		}

		function part2(): number | string {
			return 0;
		}

		Solver.create()
		.setPart1(part1)
		.setPart2(part2)
		.solve();
	`.replace(/\t\t/g, "").replace(/\n/, "");

	const directoryPath = path.join("days", formatDay(day));
	const filePath = path.join(directoryPath, Constants.CODE_FILE_NAME);

	if(!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath);
	}

	if(!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, content);
	} else {
		console.warn(`code file for day ${day} already exists; skipping`);
	}
	if(env.TERM_PROGRAM === "vscode") {
		exec(`code ${filePath}`);
	}
}