export class PromptBuilder {
  static build(system: string, userInput: any): string {
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
