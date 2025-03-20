import {
  Ollama,
  OpenAI,
  Anthropic,
  Cohere,
  DeepSeek,
  Google,
  Groq,
  Perplexity,
  DeepInfra,
} from "./model";

export const allModels = {
  ...Ollama,
  ...OpenAI,
  ...Anthropic,
  ...Cohere,
  ...Google,
  ...Groq,
  ...Perplexity,
  ...DeepInfra,
  ...DeepSeek,
};
