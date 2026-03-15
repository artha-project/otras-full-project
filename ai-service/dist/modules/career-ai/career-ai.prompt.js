"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerAiPrompt = void 0;
const careerAiPrompt = (input) => `
You are Artha Intelligence Engine. 
Analyze the candidate intelligence profile. 
Logical Score: ${input.logicalScore} 
Quant Score: ${input.quantScore} 
Verbal Score: ${input.verbalScore} 
Learning Pattern: ${input.learningPattern} 
Confidence Index: ${input.confidenceIndex} 
Interests: ${input.interests} 
Aspirations: ${input.aspirations} 
Create a structured 1-year career roadmap. 
Return JSON: 
{ 
"summary": "", 
"recommendations": [], 
"sixMonth": ["Step 1", "Step 2"], 
"oneYear": ["Goal 1", "Goal 2"] 
}
`;
exports.careerAiPrompt = careerAiPrompt;
//# sourceMappingURL=career-ai.prompt.js.map