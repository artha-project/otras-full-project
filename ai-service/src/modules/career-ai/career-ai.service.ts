import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { careerAiPrompt } from './career-ai.prompt';
import { languageInstructions } from '../../localization/language-map';

@Injectable()
export class CareerAiService {
  constructor(private readonly aiService: AiService) {}

  async generate(payload: any) {
    try {
      const language = payload.language || 'en';
      const languageInstruction = languageInstructions[language] || languageInstructions.en;
      
      const prompt = careerAiPrompt(payload);
      const systemPrompt = `${languageInstruction}\n\n${prompt}`;
      
      const response = await this.aiService.generate(systemPrompt, payload);
      
      if (typeof response !== 'string') return response;

      let clean = response.replace(/```json/g, "").replace(/```/g, "");
      clean = clean.replace(/`json/g, "").replace(/`/g, "").trim();

      try {
        return JSON.parse(clean);
      } catch (parseError) {
        console.warn("Career AI parse failed, attempting auto-repair...");
        try {
          clean = clean.substring(0, clean.lastIndexOf("}") + 1);
          return JSON.parse(clean);
        } catch (repairError) {
          console.error("Career AI auto-repair failed", repairError);
          // Return raw to let frontend handle or try to extract
          return { error: "Response malformed", raw: response };
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate career roadmap.',
      );
    }
  }
}
