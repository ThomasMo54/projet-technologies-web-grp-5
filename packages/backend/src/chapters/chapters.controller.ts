import { Controller, Get, Post, Put, Delete, Body, Param, Request, ForbiddenException } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './chapter.schema';
import { CoursesService } from '../courses/courses.service';

@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto, @Request() req: any): Promise<Chapter> {
    // Vérifier que l'utilisateur est le créateur du cours
    const course = await this.coursesService.findCourseById(createChapterDto.courseId);
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only create chapters for your own courses');
    }
    return this.chaptersService.createChapter(createChapterDto);
  }

  @Get()
  async findAll(): Promise<Chapter[]> {
    return this.chaptersService.findAllChapters();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access this chapter');
    }
    return chapter;
  }

  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string, @Request() req: any): Promise<Chapter[]> {
    const course = await this.coursesService.findCourseById(courseId);
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access this course');
    }
    return this.chaptersService.findChaptersByCourse(courseId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only update chapters for your own courses');
    }
    return this.chaptersService.updateChapter(id, updateChapterDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only delete chapters for your own courses');
    }
    return this.chaptersService.deleteChapter(id);
  }
}