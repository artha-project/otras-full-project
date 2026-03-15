import { AiService } from '../../ai/ai.service';
export declare class CareerAiService {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(payload: any): Promise<any>;
}
