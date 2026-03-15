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
var IntelligenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const prompt_1 = require("./prompt");
let IntelligenceService = IntelligenceService_1 = class IntelligenceService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(IntelligenceService_1.name);
    }
    async generateFeedback(rawTier, data) {
        const tier = parseInt(rawTier || "1", 10);
        const input = data;
        console.log("ARTHA Tier detected:", tier);
        console.log("ARTHA AI input data:", input);
        let prompt;
        let promptType;
        if (tier === 1) {
            prompt = (0, prompt_1.intelligencePromptTier1)(input);
            promptType = "intelligencePromptTier1";
        }
        else if (tier === 2) {
            prompt = (0, prompt_1.intelligencePromptTier2)(input);
            promptType = "intelligencePromptTier2";
        }
        else if (tier === 3) {
            console.log("AI Tier3 Input:", input);
            prompt = (0, prompt_1.intelligencePromptTier3)(input);
            promptType = "intelligencePromptTier3";
        }
        else {
            this.logger.error(`ARTHA AI: Unsupported tier: ${tier}`);
            return null;
        }
        console.log("ARTHA Prompt Used:", promptType);
        try {
            const response = await this.aiService.generate(prompt, {});
            console.log("ARTHA: AI output generated");
            console.log("LLM Raw Output:", response);
            const parsed = this.safeParse(response, tier);
            return this.finalizeFeedback(parsed);
        }
        catch (error) {
            this.logger.error("ARTHA AI Critical failure:", error.message);
            return this.getFallback(tier);
        }
    }
    finalizeFeedback(parsed) {
        if (!parsed)
            return null;
        const flatten = (val) => {
            if (typeof val === 'object' && val !== null) {
                return Object.values(val).map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ');
            }
            return String(val || "");
        };
        const result = {};
        Object.keys(parsed).forEach(key => {
            result[key] = flatten(parsed[key]);
        });
        return result;
    }
    safeParse(response, tier) {
        let clean = response.trim();
        clean = clean.replace(/```json/g, "").replace(/```/g, "");
        clean = clean.replace(/`json/g, "").replace(/`/g, "").trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            clean = clean.substring(start, end + 1);
        }
        console.log("Sanitized ARTHA Output Pre-isolate:", clean);
        try {
            return JSON.parse(clean);
        }
        catch (e1) {
            this.logger.warn('ARTHA AI: standard JSON parse failed, trying deep repair');
            try {
                return this.deepRepairJSON(clean);
            }
            catch (e2) {
                this.logger.error('ARTHA AI: All JSON parsing strategies failed');
                return this.regexFallback(response, tier);
            }
        }
    }
    deepRepairJSON(input) {
        let repaired = "";
        const stack = [];
        let inString = false;
        let escaped = false;
        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            if (escaped) {
                repaired += char;
                escaped = false;
                continue;
            }
            if (char === '\\') {
                repaired += char;
                escaped = true;
                continue;
            }
            if (char === '"') {
                repaired += char;
                inString = !inString;
                continue;
            }
            if (inString) {
                if (char === '\n')
                    repaired += '\\n';
                else if (char === '\r') { }
                else if (char === '‘' || char === '’')
                    repaired += "'";
                else if (char === '“' || char === '”')
                    repaired += "'";
                else
                    repaired += char;
            }
            else {
                if (char === '{' || char === '[') {
                    stack.push(char);
                    repaired += char;
                }
                else if (char === '}') {
                    if (stack.length > 0 && stack[stack.length - 1] === '{') {
                        stack.pop();
                        repaired += char;
                    }
                }
                else if (char === ']') {
                    if (stack.length > 0 && stack[stack.length - 1] === '[') {
                        stack.pop();
                        repaired += char;
                    }
                }
                else
                    repaired += char;
            }
        }
        let finalStr = repaired.trim();
        if (inString)
            finalStr += '"';
        finalStr = finalStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        while (stack.length > 0) {
            const open = stack.pop();
            if (open === '{')
                finalStr += '}';
            else if (open === '[')
                finalStr += ']';
        }
        finalStr = finalStr.replace(/"\s*"/g, '", "');
        return JSON.parse(finalStr);
    }
    regexFallback(response, tier) {
        this.logger.warn('ARTHA AI: Using regex extraction fallback');
        const extract = (key) => {
            const match = response.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i'));
            return match ? match[1] : null;
        };
        if (tier === 1) {
            return {
                logicalFoundation: extract('logicalFoundation') || 'Logical profile analysis completed.',
                subjectDepth: extract('subjectDepth') || 'Subject depth analysis completed.',
                readinessInsight: extract('readinessInsight') || 'Readiness analysis completed.',
            };
        }
        else if (tier === 2) {
            return {
                subjectStrength: extract('subjectStrength') || 'Subject competency analysis completed.',
                weakAreas: extract('weakAreas') || 'Area of improvement identified.',
                preparationAdvice: extract('preparationAdvice') || 'Exam-specific strategy recommended.',
            };
        }
        else if (tier === 3) {
            return {
                accuracyInsight: extract('accuracyInsight') || 'Accuracy trend analysis completed.',
                speedInsight: extract('speedInsight') || 'Time management analysis completed.',
                consistencyInsight: extract('consistencyInsight') || 'Performance consistency evaluated.',
            };
        }
        return this.getFallback(tier);
    }
    getFallback(tier) {
        if (tier === 1)
            return { logicalFoundation: "Analysis pending.", subjectDepth: "Analysis pending.", readinessInsight: "Analysis pending." };
        if (tier === 2)
            return { subjectStrength: "Analysis pending.", weakAreas: "Analysis pending.", preparationAdvice: "Analysis pending." };
        return { accuracyInsight: "Analysis pending.", speedInsight: "Analysis pending.", consistencyInsight: "Analysis pending." };
    }
};
exports.IntelligenceService = IntelligenceService;
exports.IntelligenceService = IntelligenceService = IntelligenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], IntelligenceService);
//# sourceMappingURL=intelligence.service.js.map