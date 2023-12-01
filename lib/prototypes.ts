if (!Array.prototype.sum) {
	Array.prototype.sum = function sum<T>(this: T[]): number {
	  	return this.reduce((acc, v) => typeof v == "number" ? acc + v : acc, 0);
	};
}
if (!Array.prototype.product) {
	Array.prototype.product = function sum<T>(this: T[]): number {
	  	return this.reduce((acc, v) => typeof v == "number" ? acc * v : acc, 1);
	};
}

if (!Map.prototype.increment) {
	Map.prototype.increment = function increment<K, V>(this: Map<K, V >, key: K): void {
		if(!this.has(key)) {
			this.set(key, 1 as any);
		} else if(this.has(key) && typeof this.get(key) === "number") {
			this.set(key, (this.get(key) as unknown as number) + 1 as any);
		}
	};
}