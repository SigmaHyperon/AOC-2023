export{}
declare global {
	interface Array<T>  {
		sum(): number;
		product(): number;
	}

	interface Map<K, V> {
		increment(value: K): void;
	}
}