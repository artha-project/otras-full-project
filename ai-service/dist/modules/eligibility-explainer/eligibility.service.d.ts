import { AiService } from '../../ai/ai.service';
export declare class EligibilityService {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(payload: any): Promise<string>;
}
