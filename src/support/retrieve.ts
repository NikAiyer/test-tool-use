import "dotenv/config";

import { ChromaVector } from "@mastra/chroma";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const { embedding } = await embed({
  value: "Explain technical analysis",
  model: openai.embedding("text-embedding-3-small"),
});

const vector = new ChromaVector({
  path: "http://localhost:8000",
});
const results = await vector.query("embeddings", embedding, 10);

console.log(results);
