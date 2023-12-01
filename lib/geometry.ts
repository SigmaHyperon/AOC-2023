export class Point2 {
	x: number;
	y: number;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

	toString() {
		return `${this.x},${this.y}`;
	}
}

export class Point3 extends Point2 {
	z: number;

	constructor(x?: number, y?: number, z?:number) {
		super(x, y);
		this.z = z ?? 0;
	}

	toString() {
		return `${super.toString()},${this.z}`;
	}
}

export class Vector3 {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(v: Vector3): Vector3 {
		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	}

	subtract(v: Vector3): Vector3 {
		return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
	}

	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	rotateX(): Vector3 {
		return new Vector3(this.x, this.z, -this.y);
	}

	rotateY(): Vector3 {
		return new Vector3(this.z, this.y, -this.x);
	}

	rotateZ(): Vector3 {
		return new Vector3(this.y, -this.x, this.z);
	}

	flip(): Vector3 {
		return new Vector3(-this.x, -this.y, -this.z);
	}

	equals(v: Vector3) {
		return this.x == v.x && this.y == v.y && this.z == v.z;
	}

	manhattenDistance(): number {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}
}