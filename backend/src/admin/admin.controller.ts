import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin/auth')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('register')
    async register(@Body() body: any) {
        return this.adminService.register(body);
    }

    @Post('login')
    async login(@Body() body: any) {
        const admin = await this.adminService.validateAdmin(body.email, body.password);
        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.adminService.login(admin);
    }
}
