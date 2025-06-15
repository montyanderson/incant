import OpenAI from "@openai/openai";

/**
 * incant configuration object
 */
export type IncantConfig = {
	/**
	 * incant reads your env var dictionary to look for api keys & other configs
	 */
	env: any;
};

export type Incant = {
	/**
	 * create a selector function to return a single option of input array
	 */
	createSelector: <Option>(
		criteria: string,
	) => (options: Option[]) => Promise<Option>;
	/**
	 * create a filtration function to return a subset of input array
	 */
	createFilter: <Element>(
		criteria: string,
	) => (elements: Element[]) => Promise<Element[]>;
};

const getOpenAIClient = (config: IncantConfig) => {
	const apiKey = config?.env.OPENAI_API_KEY;

	if (apiKey === undefined) {
		throw new Error("Couldn't find OpenAI Api Key");
	}

	return new OpenAI({
		apiKey,
	});
};

const getDefaultModel = (config: IncantConfig) => {
	return config.env.OPENAI_DEFAULT_MODEL || "gpt-4o";
};

/**
 * create a new incant instance ;)
 */
export const createIncant = (config: IncantConfig): Incant => {
	const client = getOpenAIClient(config);
	const defaultModel = getDefaultModel(config);

	const createSelector =
		<Option>(criteria: string) =>
		async (options: Option[]): Promise<Option> => {
			const response = await client.responses.create({
				model: defaultModel,
				instructions:
					`You are a selection agent.\nYour job is to pick the best option given specified criteria: ${criteria}\nRespond with the _index_ of the best option.`,
				input: JSON.stringify(
					options.map((option, index) => ({
						index: index,
						option,
					})),
					null,
					"\t",
				),
			});

			const index = parseInt(response.output_text);

			if (isNaN(index) || index < 0 || index >= options.length) {
				throw new Error("Bad LLM Response!");
			}

			return options[index];
		};

	const createFilter =
		<Element>(criteria: string) =>
		async (elements: Element[]): Promise<Element[]> => {
			const results = await Promise.all(elements.map(async (element) => {
				const response = await client.responses.create({
					model: defaultModel,
					instructions:
						`You are a filter agent.\nYour job is to return whether an item matches the criteria: ${criteria}\nRespond only with true or false.`,
					input: JSON.stringify(
						element,
						null,
						"\t",
					),
				});

				return response.output_text.toLowerCase() === "true";
			}));

			return elements.filter((_, index) => results[index]);
		};

	return { createSelector, createFilter };
};
