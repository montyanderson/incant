# incant

Add magic spells to your code.

![dancing](./twin-peaks-audrey-horne.gif)

## usage

```typescript
// incant looks in your env array for an OPENAI_API_KEY & other vars
// easy to end users to configure for your cli
const { createSelector } = createIncant({
	env: Deno.env.toObject(),
});

// create a llm-powered function to pick highest number
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
