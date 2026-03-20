import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: any): Promise<{
        access_token: string;
        admin: any;
    }>;
    login(admin: any): Promise<{
        access_token: string;
        admin: any;
    }>;
    validateAdmin(email: string, pass: string): Promise<any>;
}
