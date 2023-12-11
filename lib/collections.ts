import { Point2 } from "./geometry";

export class Lists {
	static count<T>(list: T[]): Map<T, number>;
	static count<T, K>(list: T[], criterium?: (value: T) => K): Map<K | T, number> {
		return list.reduce((acc, v) => {
			const key = typeof criterium === "function" ? criterium(v) : v;
			acc.set(key, (acc.get(key) ?? 0) + 1);
			return acc;
		}, new Map<K | T, number>());
	}

	static equals<T>(list1: T[], list2: T[]) {
		if(list1.length != list2.length) {
			return false;
		}
		for(let [index, value] of list1.entries()) {
			if(list2[index] != value) {
				return false;
			}
		}
		return true;
	}

	static unique<T>(list: T[]): T[] {
		function onlyUnique(value: T, index: number, self: T[]) {
			return self.indexOf(value) === index;
		}
		return list.filter(onlyUnique);		  
	}

	static window<T>(list: T[], index: number, width: number): T[] {
		if(index + width > list.length) 
			throw "window out of bounds";
		return list.slice(index, index + width);
	}

	static group<T>(list: T[], width: number): T[][] {
		const res: T[][] = [];
		try {
			for(let i = 0; i < list.length; i += width) {
				res.push(this.window(list, i, width));
			}
		} catch(e) {

		}
		return res;
	}

	static zip<T, K>(a: T[], b: K[]):[T, K][] {
		return a.map((k, i) => [k, b[i]]);
	}
}

export class Sets {
	static equals<T>(set1: Set<T>, set2: Set<T>): boolean {
		if (set1.size !== set2.size) return false;
		for (let a of set1) if (!set2.has(a)) return false;
		return true;
	}
}

export enum Direction {
	Up,
	Down,
	Left,
	Right
}

export class Matrix<T> {
	matrix: T[][];
	height: number;
	width: number;
	constructor(matrix: T[][]) {
		this.width = matrix[0].length;
		this.height = matrix.length;
		for(let line of matrix) {
			if(line.length != this.width) {
				throw "Matrix not rectangular";
			}
		}
		this.matrix = [];
		for(let h = 0; h < this.height; h++) {
			this.matrix[h] = matrix[h].slice();
		}
	}

	public hasValueAt(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	public valueAt(x: number, y: number): T | null {
		return this.hasValueAt(x, y) ? this.matrix[y][x] : null; 
	}

	public matrixValueAt(x: number, y: number): MatrixValue<T> | null {
		return this.hasValueAt(x, y) ? new MatrixValue(x, y, this.matrix[y][x]) : null; 
	}

	public neighbours(x: number, y: number, includeDiagonal: boolean = false): MatrixValue<T>[] {
		const neighbours: MatrixValue<T>[] = [];
		neighbours.push(new MatrixValue(x, y-1, this.valueAt(x, y-1)));
		neighbours.push(new MatrixValue(x-1, y, this.valueAt(x - 1, y)));
		neighbours.push(new MatrixValue(x, y+1, this.valueAt(x, y + 1)));
		neighbours.push(new MatrixValue(x+1, y, this.valueAt(x + 1, y)));
		if(includeDiagonal) {
			neighbours.push(new MatrixValue(x-1, y-1, this.valueAt(x-1, y-1)));
			neighbours.push(new MatrixValue(x-1, y+1, this.valueAt(x-1, y+1)));
			neighbours.push(new MatrixValue(x+1, y-1, this.valueAt(x+1, y-1)));
			neighbours.push(new MatrixValue(x+1, y+1, this.valueAt(x+1, y+1)));
		}
		return neighbours.filter(v => v.value != null);
	}

	public values(): MatrixValue<T>[] {
		const values: MatrixValue<T>[] = [];
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				values.push(new MatrixValue(x, y, this.valueAt(x, y)));
			}
		}
		return values;
	}

	public apply(x: number, y: number, manipulator: (current: T) => T) {
		if(this.hasValueAt(x, y)) {
			const current = this.valueAt(x,y);
			const replaceWith = manipulator(current);
			this.matrix[y][x] = replaceWith;
		}
	}

	public isEdge(x: number, y: number): boolean {
		return x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1;
	}

	public rayCast(x: number, y: number, direction: Direction): T[] {
		if(direction === Direction.Left) {
			return this.matrix[y].slice(0, x).reverse();
		} else if(direction === Direction.Right) {
			return this.matrix[y].slice(x + 1);
		} else if(direction === Direction.Up) {
			const res: T[] = [];
			for(let i = 0; i < y; i++) {
				res.push(this.valueAt(x, i));
			}
			return res.reverse();
		} else {
			const res: T[] = [];
			for(let i = y + 1; i < this.height; i++) {
				res.push(this.valueAt(x, i));
			}
			return res;
		}
	}

	public print(toString?: (value: T) => string) {
		for(let r = 0; r < this.height; r++) {
			const row = this.matrix[r];
			console.log((toString ? row.map(v => toString(v)) : row).join(","));
		}
	}
}

export class MatrixValue<T> extends Point2 {
	value: T;
	constructor(x: number, y: number, value: T) {
		super(x, y);
		this.value = value;
	}
}

export class Stack<T> {
	stack: T[] = [];

	push(value: T) {
		this.stack.push(value);
	}

	pop(): T {
		return this.stack.pop();
	}

	peek(): T {
		return this.stack[this.stack.length - 1];
	}
}

export class PriorityQueue<T> {
	queue: {id?: string, value: T, priority: number}[];
	constructor() {
		this.queue = [];
	}

	push(value: T, priority: number, id?: string){
		if(id) {
			const index = this.queue.findIndex(v => v.id === id);
			if(index >= 0) {
				this.queue.splice(index, 1);
			}
		} else {
			const index = this.queue.findIndex(v => v.value === value);
			if(index >= 0) {
				this.queue.splice(index, 1);
			}
		}
		for(let i = 0; i < this.queue.length; i++) {
			if(priority < this.queue[i].priority) {
				this.queue.splice(i, 0, {id, value, priority});
				return;
			}
		}
		this.queue.push({value, priority});
	}

	pop(): T | null {
		return this.queue.shift()?.value;
	}
}

export function isNode<T>(element: TreeNode<T> | T): element is TreeNode<T> {
	return typeof element === "object" && "ident" in element && element.ident === "node";
}

export class TreeNode<T> {
	ident = "node";
	children: (TreeNode<T> | T)[];
	constructor() {
		this.children = [];
	}
}