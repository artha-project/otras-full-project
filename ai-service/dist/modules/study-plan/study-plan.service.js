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
var StudyPlanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const prompt_1 = require("./prompt");
let StudyPlanService = StudyPlanService_1 = class StudyPlanService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(StudyPlanService_1.name);
    }
    async generate(input) {
        try {
            const prompt = (0, prompt_1.studyPlanPrompt)(input);
            console.log("Generated Prompt:", prompt);
            let result;
            try {
                console.log("Calling AI service with payload:", input);
                result = await this.aiService.generate(prompt, input);
                console.log("LLM Raw Output Length:", result?.length);
            }
            catch (aiError) {
                console.error("AI Tier failed critically:", aiError.message);
                return this.getFallback();
            }
            let clean = this.sanitizeRawResponse(result);
            console.log("Sanitized Output (First 500 chars):", clean.substring(0, 500));
            try {
                const parsed = JSON.parse(clean);
                console.log("AI JSON parsed successfully");
                return this.validateAndFinalize(parsed);
            }
            catch (error) {
                console.warn("Standard JSON.parse failed, initiating deep repair...");
                try {
                    const repaired = this.deepRepairJSON(clean);
                    console.log("AI JSON deep repair successful");
                    return this.validateAndFinalize(repaired);
                }
                catch (repairError) {
                    console.error("Deep repair failed:", repairError.message);
                    return this.getFallback();
                }
            }
        }
        catch (error) {
            console.error("Critical failure in AI StudyPlanService:", error);
            return this.getFallback();
        }
    }
    sanitizeRawResponse(raw) {
        if (!raw)
            return "";
        let clean = raw.trim();
        clean = clean.replace(/```json/g, "").replace(/```/g, "");
        clean = clean.replace(/`json/g, "").replace(/`/g, "").trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            clean = clean.substring(start, end + 1);
        }
        return clean;
    }
    validateAndFinalize(parsed) {
        const flatten = (val) => {
            if (typeof val === 'object' && val !== null) {
                return Object.values(val)
                    .map(v => typeof v === 'object' ? JSON.stringify(v) : String(v))
                    .join(' ');
            }
            return String(val || "");
        };
        if (parsed.summary)
            parsed.summary = flatten(parsed.summary);
        if (Array.isArray(parsed.recommendations)) {
            parsed.recommendations = parsed.recommendations.map(flatten);
        }
        if (Array.isArray(parsed.weeklyPlan)) {
            parsed.weeklyPlan = parsed.weeklyPlan.map(day => ({
                ...day,
                day: flatten(day.day),
                activities: Array.isArray(day.activities) ? day.activities.map(act => ({
                    timeSlot: flatten(act.timeSlot),
                    description: flatten(act.description),
                    focusArea: flatten(act.focusArea)
                })) : []
            }));
        }
        if (!parsed.weeklyPlan || !parsed.summary || !parsed.recommendations) {
            console.error("AI response missing required fields");
            return {
                weeklyPlan: parsed.weeklyPlan || [],
                summary: parsed.summary || "AI plan generated with partial data.",
                recommendations: parsed.recommendations || []
            };
        }
        return parsed;
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
                if (char === '\n') {
                    repaired += '\\n';
                }
                else if (char === '\r') {
                }
                else if (char === '\t') {
                    repaired += ' ';
                }
                else if (char === '‘' || char === '’') {
                    repaired += "'";
                }
                else if (char === '“' || char === '”') {
                    repaired += "'";
                }
                else {
                    repaired += char;
                }
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
                else if (/\s/.test(char)) {
                    repaired += char;
                }
                else {
                    repaired += char;
                }
            }
        }
        let finalStr = repaired.trim();
        if (inString) {
            finalStr += '"';
        }
        finalStr = finalStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        while (stack.length > 0) {
            const open = stack.pop();
            if (open === '{')
                finalStr += '}';
            else if (open === '[')
                finalStr += ']';
        }
        finalStr = finalStr.replace(/"\s*"/g, '", "');
        try {
            return JSON.parse(finalStr);
        }
        catch (e) {
            this.logger.error("Deep repair failed to produce valid JSON", e.message);
            return this.regexSalvage(finalStr);
        }
    }
    regexSalvage(input) {
        console.log("Regex salvage initiating...");
        const summaryMatch = input.match(/"summary"\s*:\s*"([^"]*)"/);
        const summary = summaryMatch ? summaryMatch[1] : "AI plan failed to parse.";
        return {
            weeklyPlan: [],
            summary: summary,
            recommendations: []
        };
    }
    getFallback() {
        return {
            weeklyPlan: [],
            summary: "AI study plan generation failed. Returning safe template.",
            recommendations: []
        };
    }
};
exports.StudyPlanService = StudyPlanService;
exports.StudyPlanService = StudyPlanService = StudyPlanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], StudyPlanService);
//# sourceMappingURL=study-plan.service.js.map