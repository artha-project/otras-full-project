import { AiService } from '../../ai/ai.service';
export declare class ReportService {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(payload: any): Promise<string>;
}
