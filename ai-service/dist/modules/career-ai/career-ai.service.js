"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerAiService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const career_ai_prompt_1 = require("./career-ai.prompt");
const language_map_1 = require("../../localization/language-map");
let CareerAiService = class CareerAiService {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generate(payload) {
        try {
            const language = payload.language || 'en';
            const languageInstruction = language_map_1.languageInstructions[language] || language_map_1.languageInstructions.en;
            const prompt = (0, career_ai_prompt_1.careerAiPrompt)(payload);
            const systemPrompt = `${languageInstruction}\n\n${prompt}`;
            const response = await this.aiService.generate(systemPrompt, payload);
            if (typeof response !== 'string')
                return response;
            let clean = response.replace(/```json/g, "").replace(/```/g, "");
            clean = clean.replace(/`json/g, "").replace(/`/g, "").trim();
            try {
                return JSON.parse(clean);
            }
            catch (parseError) {
                console.warn("Career AI parse failed, attempting auto-repair...");
                try {
                    clean = clean.substring(0, clean.lastIndexOf("}") + 1);
                    return JSON.parse(clean);
                }
                catch (repairError) {
                    console.error("Career AI auto-repair failed", repairError);
                    return { error: "Response malformed", raw: response };
                }
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to generate career roadmap.');
        }
    }
};
exports.CareerAiService = CareerAiService;
exports.CareerAiService = CareerAiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], CareerAiService);
//# sourceMappingURL=career-ai.service.js.map