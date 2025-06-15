import OpenAI from "jsr:@openai/openai";

export type IncantConfig = {
	env: any;
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

export const createIncant = (config: IncantConfig) => {
	const client = getOpenAIClient(config);
	const defaultModel = getDefaultModel(config);

	const createSelector =
		<Option>(criteria: string) =>
		async (options: Option[]): Promise<Option> => {
			const models = await client.models.list();

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

	return { createSelector };
};
