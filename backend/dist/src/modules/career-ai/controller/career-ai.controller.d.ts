import { CareerAIService } from '../service/career-ai.service';
export declare class CareerAIController {
    private readonly careerService;
    constructor(careerService: CareerAIService);
    generate(dto: any): Promise<{
        roadmap: any;
    }>;
}
