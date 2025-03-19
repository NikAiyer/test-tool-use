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
  ollamaModel: ollama.chat("llama3.2"),
  ollama31Model: ollama.chat("llama3.1"),
  ollamaQwen: ollama.chat("qwen2.5:7b"),
  ollamaMistral: ollama.chat("mistral"),
  ollamaMistralNemo: ollama.chat("mistral-nemo"),
  ollamaSmollm2: ollama.chat("smollm2"),
  ollamaGranite31Dense: ollama.chat("granite3.1-dense"),
  ollamaNemotronMini: ollama.chat("nemotron-mini"),
  ollamaHermes3: ollama.chat("hermes3"),
  ollamaMistralSmall: ollama.chat("mistral-small"),
  ollamaGranite3Dense: ollama.chat("granite3-dense"),
  ollamaLlama3GroqToolUse: ollama.chat("llama3-groq-tool-use"),
  ollamaAyaExpanse: ollama.chat("aya-expanse"),
  ollamaGranite3Moe: ollama.chat("granite3-moe"),
  ollamaGranite31Moe: ollama.chat("granite3.1-moe"),
  ollamaCommandR7B: ollama.chat("command-r7b"),
  ollamaQwen2: ollama.chat("qwen2"),
  ollamaQwen25: ollama.chat("qwen2.5"),
  ollamaGranite32: ollama.chat("granite3.2"),
};

// OpenAI Models
export const OpenAI = {
  gpt4: openai('gpt-4'),  // Full tool/function calling support
  gpt4oMini: openai("gpt-4o-mini"),
  gpt4o: openai('gpt-4o'),
  gpt4Turbo: openai('gpt-4-turbo-preview'),  // Full tool/function calling support
  gpt35Turbo: openai('gpt-3.5-turbo'),  // Full tool/function calling support
}
// Anthropic Models
export const Anthropic = {
  claude3Opus: anthropic("claude-3-opus-20240229"), // Full tool/function calling support
  claude3Sonnet: anthropic("claude-3-sonnet-20240229"), // Full tool/function calling support
};

// Cohere Models
export const Cohere = {
  cohereCommandR: cohere("command-r"), // Has function calling support
};

// Google Models
export const Google = {
  gemini15Pro: google("gemini-1.5-pro"), // Has function calling support
  gemini15Flash: google("gemini-1.5-flash"), // Has function calling support
};

// Groq Models
export const Groq = {
  groqMixtral: groq("mixtral-8x7b-32768"), // Has function calling support
};

// Perplexity Models
export const Perplexity = {
  sonarPro: perplexity("sonar-pro"), // 200k context
  sonarReasoning: perplexity("sonar-reasoning"), // 128k context
  sonarReasoningPro: perplexity("sonar-reasoning-pro"),
  sonar: perplexity("sonar"), // 128k context
};
// DeepInfra Models
export const DeepInfra = {
  deepinfraMistral: deepinfra("mistralai/Mistral-7B-Instruct-v0.2"),
  deepinfraMixtral: deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
  deepinfraLlama: deepinfra('meta-llama/Llama-2-70b-chat-hf')
};

// DeepSeek Models
export const DeepSeek = {
  deepseekCoder: deepseek('deepseek-coder'),
  deepseekChat: deepseek('deepseek-chat'),
}


// Mistral AI Models - Currently unavailable
// export const mistralTiny = mistral('mistral-tiny');
// export const mistralSmall = mistral('mistral-small');
// export const mistralMedium = mistral('mistral-medium');
// export const mistralLarge = mistral('mistral-large-latest');
