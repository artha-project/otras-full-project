import { AiService } from '../../ai/ai.service';
export declare class StudyPlanService {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AiService);
    generate(input: any): Promise<any>;
    private sanitizeRawResponse;
    private validateAndFinalize;
    private deepRepairJSON;
    private regexSalvage;
    private getFallback;
}
