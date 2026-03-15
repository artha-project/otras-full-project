"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
class PromptBuilder {
    static build(system, userInput) {
        return `
SYSTEM ROLE:
${system}

STRUCTURED INPUT:
${JSON.stringify(userInput, null, 2)}

IMPORTANT:
- Do not calculate scores
- Do not modify numbers
- Only explain and generate structured output
- Keep response professional and institutional
`;
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=prompt-builder.js.map