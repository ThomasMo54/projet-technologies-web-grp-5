import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fetch from "node-fetch";

@Injectable()
export class OllamaService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async generateSummary(text: string): Promise<string> {
    const prompt = `Summarize the following chapter of a course in a concise manner, I want you to only return the summary:\n\n${text}\n\n`;
    return this.generateResponse(prompt);
  }

  private async generateResponse(prompt: string): Promise<string> {
    const apiUrl = this.configService.get<string>("OLLAMA_API_URL");
    const model = this.configService.get<string>("OLLAMA_MODEL");
    const response = await fetch(`${apiUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error("Failed to fetch response from Ollama API");
    }
    const data: any = await response.json();
    return data.response;
  }
}