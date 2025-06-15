# incant

[![JSR](https://jsr.io/badges/@monty/incant)](https://jsr.io/@monty/incant)

Add magic spells to your code.

![dancing](./twin-peaks-audrey-horne.gif)

## usage

Incant gives you primtivies to integrate language model invocations safely.

> [!WARNING]
> All data provided as input to incant primitives will be sent to upstream inferene providers. Avoid sending personal and sensitive information.

```typescript
// incant looks in your env array for an OPENAI_API_KEY & other vars
// easy for end users to configure for your cli
const { createSelector, createFilter } = createIncant({
	env: Deno.env.toObject(),
});
```

### selectors

```typescript
// create a function to pick the highest number
const pickHighestNumber = createSelector<number>("Pick the highest number");

const input = [
	1,
	10,
	3,
	10000,
	5,
	999,
];

// type-safe and hallucination-safe – output is guaranteed to be one of input array
const highestNumber = await pickHighestNumber(input);
```

### filters

```typescript
// make a function to filter only male names
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

// original array ordering is preserved
// no hallucinations possible: output is guaranteed to be subset of input array
// [ "John", "Jack", "Mike", "Charlie", "Alex" ]
```
