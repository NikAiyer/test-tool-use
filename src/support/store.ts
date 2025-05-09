import "dotenv/config";

import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import fs from "fs";
import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { ChromaVector } from "@mastra/chroma";

const content = fs.readFileSync("src/documents/test.txt", "utf-8");
const doc = MDocument.fromText(content);

console.log("chunking...");
const chunks = await doc.chunk({
  strategy: "recursive",
  size: 300,
  overlap: 50,
});
console.log("chunking done");

console.log("embedding...");
const { embeddings } = await embedMany({
  model: openai.embedding("text-embedding-3-small"),
  values: chunks.map((chunk) => chunk.text),
});
console.log("embedding done");

console.log("pg...");
const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING!);
// const chromaVector = new ChromaVector({
//   path: "http://localhost:8000",
// });

console.log(embeddings[0].length);

const indexName = "testing";
await pgVector.deleteIndex(indexName);
await pgVector.createIndex({
  indexName,
  dimension: 222,
});

// Helper to categorize content
function categorizeContent(text: string): { category: string; topic: string } {
  if (text.includes("tool") && text.includes("LLM")) {
    return { category: "models", topic: "tool_usage" };
  } else if (text.includes("vector") || text.includes("RAG")) {
    return { category: "architecture", topic: "rag_systems" };
  } else if (text.includes("test") || text.includes("framework")) {
    return { category: "testing", topic: "frameworks" };
  } else if (text.includes("latency") || text.includes("throughput")) {
    return { category: "performance", topic: "metrics" };
  } else if (text.includes("deploy") || text.includes("scaling")) {
    return { category: "deployment", topic: "operations" };
  } else if (
    text.includes("RAGAS") ||
    text.includes("BLEU") ||
    text.includes("ROUGE")
  ) {
    return { category: "evaluation", topic: "metrics" };
  }
  return { category: "general", topic: "other" };
}

console.log("upserting...");
await pgVector.upsert({
  indexName,
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({
    text: chunk.text,
    ...categorizeContent(chunk.text),
    timestamp: new Date().toISOString(),
    source: "test.txt",
  })),
});
