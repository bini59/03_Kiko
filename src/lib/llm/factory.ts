import { LLMProvider, LLMProviderOptions } from "./types";
import { OpenAIProvider } from "./openai";

export function createLLMProvider(
  provider: string = "openai",
  options: LLMProviderOptions = { apiKey: "" }
): LLMProvider {
  switch (provider) {
    case "openai":
      return new OpenAIProvider(options);
    default:
      throw new Error(`지원하지 않는 LLM 프로바이더: ${provider}`);
  }
}
