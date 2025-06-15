import { createIncant } from "./mod.ts";

const { createSelector, createFilter } = createIncant({
	env: Deno.env.toObject(),
});

// selector example

const input = [
	1,
	10,
	3,
	10000,
	5,
	999,
];

const pickHighestNumber = createSelector<number>("Pick the highest number");

const highestNumber = await pickHighestNumber(input);

console.log("Highest Number:", highestNumber);

const pickLowestNumber = createSelector<number>("Pick the lowest number");

const lowestNumber = await pickLowestNumber(input);

console.log("Lowest Number:", lowestNumber);

// filter example

const filterMaleNames = createFilter<string>("Return male names");

const maleNames = await filterMaleNames([
	"John",
	"Jack",
	"Jane",
	"Beatrice",
	"Mike",
	"Emily",
	"Charlie",
	"Robin",
	"Alex",
]);

console.log("Male Names:", maleNames);
