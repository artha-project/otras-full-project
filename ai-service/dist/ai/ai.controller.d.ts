import { RoadmapService } from '../modules/roadmap/roadmap.service';
import { CareerService } from '../modules/career-guidance/career.service';
import { EligibilityService } from '../modules/eligibility-explainer/eligibility.service';
import { PerformanceService } from '../modules/performance/performance.service';
import { BurnoutService } from '../modules/burnout/burnout.service';
import { ReportService } from '../modules/report/report.service';
import { IntelligenceService } from '../modules/artha/intelligence.service';
import { AiService } from './ai.service';
export declare class AiController {
    private roadmap;
    private career;
    private eligibility;
    private performance;
    private burnout;
    private report;
    private intelligence;
    private aiService;
    constructor(roadmap: RoadmapService, career: CareerService, eligibility: EligibilityService, performance: PerformanceService, burnout: BurnoutService, report: ReportService, intelligence: IntelligenceService, aiService: AiService);
    roadmapGen(body: any): Promise<string>;
    careerGen(body: any): Promise<string>;
    eligibilityGen(body: any): Promise<string>;
    performanceGen(body: any): Promise<string>;
    burnoutGen(body: any): Promise<string>;
    reportGen(body: any): Promise<string>;
    intelligenceGen(body: any): Promise<any>;
    generateAI(body: any): Promise<string>;
}
