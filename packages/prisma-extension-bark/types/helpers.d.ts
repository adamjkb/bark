type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type ObjectFromList<T extends ReadonlyArray<string>, P extends any> = {
	readonly [K in (T extends ReadonlyArray<infer U> ? U : never)]: P
};

export type RequireKeys<T, K> = Partial<T> & Required<Pick<T, K>>;

export type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & { [P in N]: T[K] }
