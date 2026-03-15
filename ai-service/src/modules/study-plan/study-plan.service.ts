import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { studyPlanPrompt } from './prompt';

@Injectable()
export class StudyPlanService {
  private readonly logger = new Logger(StudyPlanService.name);

  constructor(private readonly aiService: AiService) {}

  async generate(input: any) {
    try {
      const prompt = studyPlanPrompt(input);
      console.log("Generated Prompt:", prompt);
      
      let result;
      try {
        console.log("Calling AI service with payload:", input);
        result = await this.aiService.generate(prompt, input);
        console.log("LLM Raw Output Length:", result?.length);
      } catch (aiError) {
        console.error("AI Tier failed critically:", aiError.message);
        return this.getFallback();
      }
      
      let clean = this.sanitizeRawResponse(result);
      console.log("Sanitized Output (First 500 chars):", clean.substring(0, 500));

      try {
        const parsed = JSON.parse(clean);
        console.log("AI JSON parsed successfully");
        return this.validateAndFinalize(parsed);
      } catch (error) {
        console.warn("Standard JSON.parse failed, initiating deep repair...");
        try {
          const repaired = this.deepRepairJSON(clean);
          console.log("AI JSON deep repair successful");
          return this.validateAndFinalize(repaired);
        } catch (repairError) {
          console.error("Deep repair failed:", repairError.message);
          return this.getFallback();
        }
      }
    } catch (error) {
      console.error("Critical failure in AI StudyPlanService:", error);
      return this.getFallback();
    }
  }

  private sanitizeRawResponse(raw: string): string {
    if (!raw) return "";
    let clean = raw.trim();
    
    // Remove markdown code blocks
    clean = clean.replace(/```json/g, "").replace(/```/g, "");
    clean = clean.replace(/`json/g, "").replace(/`/g, "").trim();
    
    // Remove common LLM "garbage" outside the JSON object
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      clean = clean.substring(start, end + 1);
    }
    
    return clean;
  }

  private validateAndFinalize(parsed: any) {
    const flatten = (val: any): string => {
      if (typeof val === 'object' && val !== null) {
        return Object.values(val)
          .map(v => typeof v === 'object' ? JSON.stringify(v) : String(v))
          .join(' ');
      }
      return String(val || "");
    };

    if (parsed.summary) parsed.summary = flatten(parsed.summary);
    
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

  /**
   * Performs deep structural repair on potentially malformed or truncated JSON.
   * Handles literal newlines, smart quotes, missing commas, and open structures.
   */
  private deepRepairJSON(input: string): any {
    let repaired = "";
    const stack: string[] = [];
    let inString = false;
    let escaped = false;

    // First pass: Escape literal newlines and handle structural characters
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
        // Handle literal newlines inside strings
        if (char === '\n') {
          repaired += '\\n';
        } else if (char === '\r') {
          // ignore
        } else if (char === '\t') {
          repaired += ' ';
        } else if (char === '‘' || char === '’') {
          repaired += "'";
        } else if (char === '“' || char === '”') {
          repaired += "'"; // Using single quotes to avoid breaking standard JSON double quotes
        } else {
          repaired += char;
        }
      } else {
        // Outside string: structural characters
        if (char === '{' || char === '[') {
          stack.push(char);
          repaired += char;
        } else if (char === '}') {
          if (stack.length > 0 && stack[stack.length - 1] === '{') {
            stack.pop();
            repaired += char;
          }
        } else if (char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === '[') {
            stack.pop();
            repaired += char;
          }
        } else if (/\s/.test(char)) {
          repaired += char;
        } else {
          repaired += char;
        }
      }
    }

    // Post-processing of the built string
    let finalStr = repaired.trim();

    // 1. Close open string
    if (inString) {
      finalStr += '"';
    }

    // 2. Remove dangling commas before objects/arrays end
    finalStr = finalStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    // 3. Close open structures in stack
    while (stack.length > 0) {
      const open = stack.pop();
      if (open === '{') finalStr += '}';
      else if (open === '[') finalStr += ']';
    }

    // 4. One last check for multiple values without commas
    // This is hard with regex, but we can try basic ones
    // Example: "key": "val" "other": "val" -> "key": "val", "other": "val"
    finalStr = finalStr.replace(/"\s*"/g, '", "');

    try {
      return JSON.parse(finalStr);
    } catch (e) {
      this.logger.error("Deep repair failed to produce valid JSON", e.message);
      // Absolute last resort: regex extraction
      return this.regexSalvage(finalStr);
    }
  }

  private regexSalvage(input: string) {
    console.log("Regex salvage initiating...");
    const summaryMatch = input.match(/"summary"\s*:\s*"([^"]*)"/);
    const summary = summaryMatch ? summaryMatch[1] : "AI plan failed to parse.";
    
    // Basic salvage for weeklyPlan (just empty array since it's too complex for basic regex)
    return {
      weeklyPlan: [],
      summary: summary,
      recommendations: []
    };
  }

  private getFallback() {
    return {
      weeklyPlan: [],
      summary: "AI study plan generation failed. Returning safe template.",
      recommendations: []
    };
  }
}