import { AiService } from '../../ai/ai.service';
export declare class IntelligenceService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    generateFeedback(rawTier: any, data: any): Promise<any>;
    private finalizeFeedback;
    private safeParse;
    private deepRepairJSON;
    private regexFallback;
    private getFallback;
}
