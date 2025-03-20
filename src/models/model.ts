import { createOllama } from "ollama-ai-provider";
import { openai } from "@ai-sdk/openai";
import { anthropic } from '@ai-sdk/anthropic';
import { cohere } from '@ai-sdk/cohere';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { perplexity } from '@ai-sdk/perplexity';
import { deepinfra } from '@ai-sdk/deepinfra';
import { deepseek } from '@ai-sdk/deepseek';
import { mistral } from "@ai-sdk/mistral";

// Ollama Models (Local)
const ollama = createOllama({
  baseURL: "http://localhost:11434/api",
});

export const Ollama = {
  "llama3.2": ollama.chat("llama3.2"),
  "llama3.1": ollama.chat("llama3.1"),
  "qwen2.5:7b": ollama.chat("qwen2.5:7b"),
  mistral: ollama.chat("mistral"),
  "mistral-nemo": ollama.chat("mistral-nemo"),
  smollm2: ollama.chat("smollm2"),
  "granite3.1-dense": ollama.chat("granite3.1-dense"),
  "nemotron-mini": ollama.chat("nemotron-mini"),
  hermes3: ollama.chat("hermes3"),
  "mistral-small": ollama.chat("mistral-small"),
  "granite3-dense": ollama.chat("granite3-dense"),
  "llama3-groq-tool-use": ollama.chat("llama3-groq-tool-use"),
  "aya-expanse": ollama.chat("aya-expanse"),
  "granite3-moe": ollama.chat("granite3-moe"),
  "granite3.1-moe": ollama.chat("granite3.1-moe"),
  "command-r7b": ollama.chat("command-r7b"),
  qwen2: ollama.chat("qwen2"),
  "qwen2.5": ollama.chat("qwen2.5"),
  "granite3.2": ollama.chat("granite3.2"),
};

// OpenAI Models
export const OpenAI = {
  "gpt-4": openai("gpt-4"), // Full tool/function calling support
  "gpt-4o-mini": openai("gpt-4o-mini"),
  "gpt-4o": openai("gpt-4o"),
  "gpt-4-turbo-preview": openai("gpt-4-turbo-preview"), // Full tool/function calling support
  "gpt-3.5-turbo": openai("gpt-3.5-turbo"), // Full tool/function calling support
};
// // Anthropic Models
export const Anthropic = {
  "claude-3-opus-20240229": anthropic("claude-3-opus-20240229"), // Full tool/function calling support
  "claude-3-sonnet-20240229": anthropic("claude-3-sonnet-20240229"), // Full tool/function calling support
};

// // Cohere Models
export const Cohere = {
  "command-r": cohere("command-r"), // Has function calling support
};

// // Google Models
export const Google = {
  "gemini-1.5-pro": google("gemini-1.5-pro"), // Has function calling support
  "gemini-1.5-flash": google("gemini-1.5-flash"), // Has function calling support
};

// // Groq Models
export const Groq = {
  "mixtral-8x7b-32768": groq("mixtral-8x7b-32768"), // Has function calling support
};

// // Perplexity Models
export const Perplexity = {
  "sonar-pro": perplexity("sonar-pro"), // 200k context
  "sonar-reasoning": perplexity("sonar-reasoning"), // 128k context
  "sonar-reasoning-pro": perplexity("sonar-reasoning-pro"),
  sonar: perplexity("sonar"), // 128k context
};
// // DeepInfra Models
export const DeepInfra = {
  "mistral-7b-instruct-v0.2": deepinfra("mistralai/Mistral-7B-Instruct-v0.2"),
  "mixtral-8x7b-instruct-v0.1": deepinfra(
    "mistralai/Mixtral-8x7B-Instruct-v0.1"
  ),
  "llama-2-70b-chat-hf": deepinfra("meta-llama/Llama-2-70b-chat-hf"),
};

// // DeepSeek Models
export const DeepSeek = {
  "deepseek-coder": deepseek("deepseek-coder"),
  "deepseek-chat": deepseek("deepseek-chat"),
};


// Mistral AI Models - Currently unavailable
// export const mistralTiny = mistral('mistral-tiny');
// export const mistralSmall = mistral('mistral-small');
// export const mistralMedium = mistral('mistral-medium');
// export const mistralLarge = mistral('mistral-large-latest');
