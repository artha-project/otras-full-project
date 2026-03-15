import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { 
    intelligencePromptTier1, 
    intelligencePromptTier2, 
    intelligencePromptTier3 
} from './prompt';

@Injectable()
export class IntelligenceService {
    private readonly logger = new Logger(IntelligenceService.name);

    constructor(private aiService: AiService) { }

    async generateFeedback(rawTier: any, data: any) {
        const tier = parseInt(rawTier || "1", 10);
        const input = data;
        
        console.log("ARTHA Tier detected:", tier);
        console.log("ARTHA AI input data:", input);

        let prompt: string;
        let promptType: string;

        if (tier === 1) {
            prompt = intelligencePromptTier1(input);
            promptType = "intelligencePromptTier1";
        } else if (tier === 2) {
            prompt = intelligencePromptTier2(input);
            promptType = "intelligencePromptTier2";
        } else if (tier === 3) {
            console.log("AI Tier3 Input:", input);
            prompt = intelligencePromptTier3(input);
            promptType = "intelligencePromptTier3";
        } else {
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
        } catch (error) {
            this.logger.error("ARTHA AI Critical failure:", error.message);
            return this.getFallback(tier);
        }
    }

    private finalizeFeedback(parsed: any) {
        if (!parsed) return null;
        const flatten = (val: any): string => {
            if (typeof val === 'object' && val !== null) {
                return Object.values(val).map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ');
            }
            return String(val || "");
        };

        const result: any = {};
        Object.keys(parsed).forEach(key => {
            result[key] = flatten(parsed[key]);
        });
        return result;
    }

    private safeParse(response: string, tier: number) {
        let clean = response.trim();
        
        // 1. Clean response (Markdown, whitespace)
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
        } catch (e1) {
            this.logger.warn('ARTHA AI: standard JSON parse failed, trying deep repair');
            try {
                return this.deepRepairJSON(clean);
            } catch (e2) {
                this.logger.error('ARTHA AI: All JSON parsing strategies failed');
                return this.regexFallback(response, tier);
            }
        }
    }

    private deepRepairJSON(input: string): any {
        let repaired = "";
        const stack: string[] = [];
        let inString = false;
        let escaped = false;

        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            if (escaped) { repaired += char; escaped = false; continue; }
            if (char === '\\') { repaired += char; escaped = true; continue; }
            if (char === '"') { repaired += char; inString = !inString; continue; }

            if (inString) {
                if (char === '\n') repaired += '\\n';
                else if (char === '\r') {}
                else if (char === '‘' || char === '’') repaired += "'";
                else if (char === '“' || char === '”') repaired += "'";
                else repaired += char;
            } else {
                if (char === '{' || char === '[') { stack.push(char); repaired += char; }
                else if (char === '}') { if (stack.length > 0 && stack[stack.length - 1] === '{') { stack.pop(); repaired += char; } }
                else if (char === ']') { if (stack.length > 0 && stack[stack.length - 1] === '[') { stack.pop(); repaired += char; } }
                else repaired += char;
            }
        }

        let finalStr = repaired.trim();
        if (inString) finalStr += '"';
        finalStr = finalStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        while (stack.length > 0) {
            const open = stack.pop();
            if (open === '{') finalStr += '}';
            else if (open === '[') finalStr += ']';
        }
        finalStr = finalStr.replace(/"\s*"/g, '", "');
        return JSON.parse(finalStr);
    }

    private regexFallback(response: string, tier: number) {
        this.logger.warn('ARTHA AI: Using regex extraction fallback');
        const extract = (key: string) => {
            const match = response.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, 'i'));
            return match ? match[1] : null;
        };

        if (tier === 1) {
            return {
                logicalFoundation: extract('logicalFoundation') || 'Logical profile analysis completed.',
                subjectDepth: extract('subjectDepth') || 'Subject depth analysis completed.',
                readinessInsight: extract('readinessInsight') || 'Readiness analysis completed.',
            };
        } else if (tier === 2) {
            return {
                subjectStrength: extract('subjectStrength') || 'Subject competency analysis completed.',
                weakAreas: extract('weakAreas') || 'Area of improvement identified.',
                preparationAdvice: extract('preparationAdvice') || 'Exam-specific strategy recommended.',
            };
        } else if (tier === 3) {
            return {
                accuracyInsight: extract('accuracyInsight') || 'Accuracy trend analysis completed.',
                speedInsight: extract('speedInsight') || 'Time management analysis completed.',
                consistencyInsight: extract('consistencyInsight') || 'Performance consistency evaluated.',
            };
        }
        return this.getFallback(tier);
    }

    private getFallback(tier: number) {
        if (tier === 1) return { logicalFoundation: "Analysis pending.", subjectDepth: "Analysis pending.", readinessInsight: "Analysis pending." };
        if (tier === 2) return { subjectStrength: "Analysis pending.", weakAreas: "Analysis pending.", preparationAdvice: "Analysis pending." };
        return { accuracyInsight: "Analysis pending.", speedInsight: "Analysis pending.", consistencyInsight: "Analysis pending." };
    }
}
