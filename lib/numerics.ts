export class Binary {
	value: string;
	constructor(value: string) {
		this.value = value;
	}

	static fromDigits(digits: number[]): Binary {
		return new Binary(digits.join(""));
	}

	static fromHex(hex: string): Binary {
		return new Binary(parseInt(hex, 16).toString(2).padStart(4, "0"));
	}

	toInt(): number {
		const digits = this.digits().reverse();
		let sum = 0;
		for(let [index, digit] of digits.entries()) {
			sum += digit * Math.pow(2, index);
		}
		return sum;
	}

	inverse(): Binary {
		return new Binary(this.value.replace(/0/g, "2").replace(/1/g, "0").replace(/2/g, "1"));
	}

	digits(): number[] {
		return this.value.split("").map(v => parseInt(v));
	}

	getDigit(index: number): number {
		return this.digits()[index];
	}
}

export class Integers {
	/**
	 * returns a range of integers starting from the lowest value of a or b and ending at the highest
	 * @example a: 7, b: 3 -> [3, 4, 5, 6, 7]
	 * @param a number
	 * @param b number
	 * @returns number[]
	 */
	static range(a: number, b: number) {
		const size = Math.abs(a - b) + 1;
		const start = Math.min(a, b);
		return [...Array(size).keys()].map(v => v + start);
	}

	/**
	 * returns a range of integers starting from a and ending at b
	 * @example a: 7, b: 3 -> [7, 6, 5, 4, 3]
	 * @param a number
	 * @param b number
	 * @returns number[]
	 */
	static directionalRange(a: number, b: number) {
		if(a <= b) {
			return this.range(a, b);
		} else {
			return this.range(a, b).reverse();
		}
	}
}