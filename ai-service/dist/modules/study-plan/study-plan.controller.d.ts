import { StudyPlanService } from './study-plan.service';
export declare class StudyPlanController {
    private readonly studyPlanService;
    constructor(studyPlanService: StudyPlanService);
    generate(input: any): Promise<any>;
}
