import { Agent, Mastra } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { createVectorQueryTool, MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";
import { embedMany } from "ai";

export const vectorizePapers = async () => {
  // Create a tool for semantic search over our paper embeddings
  const vectorQueryTool = createVectorQueryTool({
    vectorStoreName: "pgVector",
    indexName: "papers",
    model: openai.embedding("text-embedding-3-small"),
  });

  const researchAgent = new Agent({
    name: "Research Assistant",
    instructions: `You are a helpful research assistant that analyzes academic papers and technical documents.
    Use the provided vector query tool to find relevant information from your knowledge base, 
    and provide accurate, well-supported answers based on the retrieved content.
    Focus on the specific content available in the tool and acknowledge if you cannot find sufficient information to answer a question.
    Base your responses only on the content provided, not on general knowledge.`,
    model: openai("gpt-4o-mini"),
    tools: {
      vectorQueryTool,
    },
  });

  const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING!);

  const mastra = new Mastra({
    agents: { researchAgent },
    // @ts-ignore
    vectors: { pgVector },
  });

  // Load the paper
  const paperUrl = "https://arxiv.org/html/1706.03762";
  const response = await fetch(paperUrl);
  const paperText = await response.text();

  // Create document and chunk it
  const doc = MDocument.fromText(paperText);
  const chunks = await doc.chunk({
    strategy: "recursive",
    size: 512,
    overlap: 50,
    separator: "\n",
  });

  // Generate embeddings
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map((chunk) => chunk.text),
  });

  // Get the vector store instance from Mastra
  const vectorStore = mastra.getVector("pgVector");

  // Create an index for our paper chunks
  await vectorStore.createIndex({
    indexName: "papers",
    dimension: 1536,
  });

  // Store embeddings
  await vectorStore.upsert({
    indexName: "papers",
    vectors: embeddings,
    metadata: chunks.map((chunk) => ({
      text: chunk.text,
      source: "transformer-paper",
    })),
  });
};

vectorizePapers();
