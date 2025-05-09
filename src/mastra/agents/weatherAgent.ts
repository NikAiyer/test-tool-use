import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools";
import { allModels } from "../../models/allModels";

export const createWeatherAgent = (modelName: string) => {
  // @ts-ignore - Dynamic access
  const model = allModels[modelName];

  return new Agent({
    name: "Weather Agent",
    instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
    model,
    tools: { weatherTool },
  });
};

// export const WeatherAgent = createWeatherAgent("gemini-2.5-pro-exp-03-25");

// const stream = await WeatherAgent.stream(
//   "What is the weather like in New York?"
// );

// for await (const chunk of stream.textStream) {
//   console.log(chunk);
// }
  
