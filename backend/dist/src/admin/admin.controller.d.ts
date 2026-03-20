import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    register(body: any): Promise<{
        access_token: string;
        admin: any;
    }>;
    login(body: any): Promise<{
        access_token: string;
        admin: any;
    }>;
}
