import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) { }

    @UseGuards(AdminAuthGuard)
    @Post()
    create(@Body() data: any) {
        return this.subjectService.create(data);
    }

    @Get()
    findAll() {
        return this.subjectService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subjectService.findOne(+id);
    }

    @UseGuards(AdminAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.subjectService.update(+id, data);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subjectService.remove(+id);
    }
}
