import { openai } from "@ai-sdk/openai";
import { createVectorQueryTool } from "@mastra/rag";
import { Agent } from "@mastra/core/agent";
import * as models from "../../models";

/**
 * Create a RAG agent with the specified model
 * @param modelName Name of the model to use (from models/index.ts)
 * @param enableFilter Whether to enable filtering in the vector query tool
 * @returns Agent instance
 */
export function createRagAgent(modelName: string, enableFilter: boolean, instructions: string) {
  const vectorQueryTool = createVectorQueryTool({
    vectorStoreName: "pgVector",
    indexName: "testing",
    model: openai.embedding("text-embedding-3-small"),
    enableFilter: enableFilter,
  });
  // @ts-ignore - Dynamic access
  const model = models[modelName] || models.ollama31Model;

  return new Agent({
    name: "Search Agent",
    instructions,
    model,
    tools: {
      vectorQueryTool,
    },
  });
}
