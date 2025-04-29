import { createOpenAI } from "@ai-sdk/openai";
import { evaluate } from "@mastra/evals";
import { AnswerRelevancyMetric, ToxicityMetric } from "@mastra/evals/llm";
import {
  ContentSimilarityMetric,
  TextualDifferenceMetric,
} from "@mastra/evals/nlp";
import { describe, expect, it } from "vitest";
import { mastra } from "../../";
import dotenv from "dotenv";

dotenv.config();

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const model = openai("gpt-4o");

describe("evaluate", () => {
  it("should get a text response from the agent", async () => {
    const myAgent = mastra.getAgent("myAgent");
    const result = await evaluate(
      myAgent,
      "How do I make a lasagna?",
      new AnswerRelevancyMetric(model)
    );
    console.log(result);
    await evaluate(
      myAgent,
      "How do I make a lasagna?",
      new ToxicityMetric(model)
    );
    await evaluate(
      myAgent,
      "How do I make a lasagna?",
      new ContentSimilarityMetric()
    );
    await evaluate(
      myAgent,
      "How do I make a lasagna?",
      new TextualDifferenceMetric()
    );
    await expect(result.score).toBe(0.26);

  }, 0);
});
