import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { PgVector } from "@mastra/pg";
import { allModels } from "../models/allModels";
import { createWeatherAgent } from "../mastra/agents/weatherAgent";

const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING!);

const agentMap: Record<string, Agent> = {};

export const query = "What is the weather in New York?";

for (const modelName of Object.keys(allModels)) {
  // Create agents with different instruction sets
  agentMap[`${modelName}_weatherAgent`] = createWeatherAgent(modelName);
}

// Create a test Mastra instance with the vector store
export const weatherMastra = new Mastra({
  vectors: { pgVector },
  agents: agentMap,
});
