import { createIncant } from "./mod.ts";

const { createSelector } = createIncant({
	env: Deno.env.toObject(),
});

const input = [
	1,
	10,
	3,
	10000,
	5,
	999,
];

const pickHighestNumber = createSelector("Pick the highest number");

const highestNumber = await pickHighestNumber(input);

console.log("Highest Number:", highestNumber);

const pickLowestNumber = createSelector("Pick the lowest number");

const lowestNumber = await pickLowestNumber(input);

console.log("Lowest Number:", lowestNumber);
