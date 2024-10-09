// https://github.com/snico-dev/guid-typescript/blob/master/lib/guid.ts
export function createGUID() {
	return [2, 1, 1, 1, 3]
		.map((num) => {
			return gen(num);
		})
		.join("-");
}

const gen = (count: number) => {
	let out = "";
	for (let i = 0; i < count; i++) {
		out += tostring(((1 + math.random()) * 0x10000) | 0).sub(1);
	}
	return out;
};
