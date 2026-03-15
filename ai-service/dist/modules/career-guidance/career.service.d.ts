import { AiService } from '../../ai/ai.service';
export declare class CareerService {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(payload: any): Promise<string>;
}
