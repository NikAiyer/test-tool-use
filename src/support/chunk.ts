import "dotenv/config";

import { MDocument } from "@mastra/rag";
import fs from "fs";
import { openai } from "@ai-sdk/openai";

const content = fs.readFileSync("src/documents/test.txt", "utf-8");
const doc = MDocument.fromText(content);

const chunksDefault = await doc.chunk({
  strategy: "recursive",
  size: 300,
  overlap: 50,
});

// console.log(
//   "chunksDefault",
//   chunksDefault.map((c) => c.metadata)
// );

// const chunksExtractDefault = await doc.chunk({
//   strategy: "recursive",
//   size: 500,
//   overlap: 50,
//   extract: {
//     title: true,
//     summary: true,
//     questions: true,
//     keywords: true,
//   },
// });

// console.log(
//   "chunksExtractDefault",
//   chunksExtractDefault.map((c) => c.metadata)
// );

const chunksExtractCustom = await doc.chunk({
  strategy: "recursive",
  size: 500,
  overlap: 50,
  extract: {
    // Title extraction with custom settings
    title: {
      nodes: 2, // Extract 2 title nodes
      nodeTemplate: "Generate a title for this: {context}",
      combineTemplate: "Combine these titles: {context}",
    },

    // Summary extraction with custom settings
    summary: {
      summaries: ["self", "prev", "next"], // Generate summaries for current and previous chunks
      promptTemplate: "Summarize this: {context}",
    },

    // Question generation with custom settings
    questions: {
      questions: 3, // Generate 3 questions
      promptTemplate: "Generate {numQuestions} questions about: {context}",
      embeddingOnly: false,
    },

    // Keyword extraction with custom settings
    keywords: {
      keywords: 5, // Extract 5 keywords
      promptTemplate: "Extract {maxKeywords} key terms from: {context}",
    },
  },
});

console.log(
  "chunksExtractCustom",
  chunksExtractCustom.map((c) => c.metadata)
);
