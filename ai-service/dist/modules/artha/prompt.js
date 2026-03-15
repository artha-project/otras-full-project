"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intelligencePromptTier3 = exports.intelligencePromptTier2 = exports.intelligencePromptTier1 = void 0;
const intelligencePromptTier1 = (input) => `
You are a career readiness analyst specializing in Indian competitive examinations.

Candidate Data:

Logical Score: ${input.logicalScore}
Quant Score: ${input.quantScore}
Verbal Score: ${input.verbalScore}
Percentile: ${input.percentile}

Analyze the candidate's core aptitude profile for career readiness.

Return JSON:

{
"logicalFoundation":"",
"subjectDepth":"",
"readinessInsight":""
}

STRICT RULES:
1. Return ONLY valid JSON.
2. No explanation, no backticks, no markdown code blocks.
3. Each value must be 1-3 sentences.
4. You MUST reference the specific numeric scores provided and explain their significance for career readiness.
5. Avoid generic placeholders like "Performance evaluated" or "Analysis completed". 
6. Be clinical and data-driven in your assessment.
`;
exports.intelligencePromptTier1 = intelligencePromptTier1;
const intelligencePromptTier2 = (input) => `
You are an exam preparation analyst for Indian government examinations.

Candidate Data:

Selected Exam: ${input.selectedExam}
Subjects Attempted:
${Object.keys(input.subjectScores).join(", ")}

Subject Scores:
${JSON.stringify(input.subjectScores)}

Analyze the candidate’s subject competency based on the requirements of the selected exam.

Return JSON:

{
"subjectStrength":"",
"weakAreas":"",
"preparationAdvice":""
}

STRICT RULES:
1. Return ONLY valid JSON.
2. No explanation, no backticks, no markdown code blocks.
3. Each value must be 1-3 sentences.
4. Explain how the candidate performs relative to the chosen exam pattern.
5. Only refer to the subjects listed in "Subjects Attempted".
6. Do not invent new subjects.
7. Do not rename subjects.
8. Use the exact subject names provided.
9. You MUST reference the specific subject scores and explain their impact on the outcome of ${input.selectedExam}.
10. Prohibit generic feedback; ensure analysis is strictly tied to the provided scores.
`;
exports.intelligencePromptTier2 = intelligencePromptTier2;
const intelligencePromptTier3 = (input) => `
You are a performance analyst for competitive exam preparation.

Candidate Performance Data:

Accuracy: ${input.accuracy}%
Average Speed: ${input.speed} seconds per question
Consistency Score: ${input.consistency}/100

Analyze the candidate's test performance.

Return JSON:

{
"accuracyInsight":"",
"speedInsight":"",
"consistencyInsight":""
}

STRICT RULES:
1. Return ONLY valid JSON.
2. No explanation, no backticks, no markdown code blocks.
3. Each value must be 1-3 sentences.
4. Analyze accuracy trends, time management efficiency, and performance consistency based EXPLICITLY on the provided percentages and speed.
5. You MUST reference the specific Accuracy (${input.accuracy}%), Speed (${input.speed} seconds/question), and Consistency (${input.consistency}) values in your analysis.
6. If Speed is low (e.g., < 5 seconds/question), highlight potential impulsive answering. If Speed is high (e.g., > 120 seconds/question), highlight slow processing.
7. Prohibit generic, template-style responses. Output must be unique to this specific performance data.
`;
exports.intelligencePromptTier3 = intelligencePromptTier3;
//# sourceMappingURL=prompt.js.map