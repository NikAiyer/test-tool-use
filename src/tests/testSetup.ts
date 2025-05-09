import { Mastra } from "@mastra/core";
import { createRagAgent } from "../mastra/agents/ragAgent";
import { Agent } from "@mastra/core/agent";
import { PgVector } from "@mastra/pg";
import { PGVECTOR_PROMPT } from "@mastra/rag";
import { allModels } from "../models/allModels";

const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING!);

const agentMap: Record<string, Agent> = {};

export const query =
  "What capabilities do different LLM models have for tool usage?";
export const filterQuery =
  "Use a topK of 3 and a filter of { category: 'models', topic: 'tool_usage' }";

export const basicInstructions = `You are a helpful assistant that can search through documents. Use the vectorQueryTool to find relevant information.`;

// Detailed instruction set
export const detailedInstructions = `You are a helpful assistant that can search through documents using the vectorQueryTool.
  When using the tool:
  1. Always provide queryText as a clear search phrase
  2. Use topK parameter (default: 3) to limit results
  3. If filter is enabled, use it appropriately
  Process the results and provide a coherent response.`;

// export const basicInstructions = `You are a helpful assistant that can search through documents. Use the tool provided to find relevant information.`;

// // Detailed instruction set
// export const detailedInstructions = `
// You are a helpful assistant that answers questions based on the provided context. Keep your answers concise and relevant.

// Filter the context by searching the metadata.

// The metadata is structured as follows:

// {
//   text: string,
//   category: string,
//   topic: string,
//   timestamp: string,
//   source: string,
// }

// ${PGVECTOR_PROMPT}
// `;

for (const modelName of Object.keys(allModels)) {
  // Create agents with different instruction sets
  agentMap[`${modelName}_ragBasicNoFilter`] = createRagAgent(
    modelName,
    false,
    basicInstructions
  );
  agentMap[`${modelName}_ragBasicFilter`] = createRagAgent(
    modelName,
    true,
    basicInstructions
  );
  agentMap[`${modelName}_ragDetailedNoFilter`] = createRagAgent(
    modelName,
    false,
    detailedInstructions
  );
  agentMap[`${modelName}_ragDetailedFilter`] = createRagAgent(
    modelName,
    true,
    detailedInstructions
  );
}

// Create a test Mastra instance with the vector store
export const ragMastra = new Mastra({
  vectors: { pgVector },
  agents: agentMap,
});
