import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './chapter.schema';
import { CoursesService } from '../courses/courses.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('chapters')
export class ChaptersController {
  constructor(
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createChapterDto: CreateChapterDto, @Request() req: any): Promise<Chapter> {
    // Vérifier que l'utilisateur est le créateur du cours
    const course = await this.coursesService.findCourseById(createChapterDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.chaptersService.createChapter(createChapterDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Chapter[]> {
    return this.chaptersService.findAllChapters();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new NotFoundException('Associated course not found');
    }
    return chapter;
  }

  @Get('course/:courseId')
  @UseGuards(AuthGuard('jwt'))
  async findByCourse(@Param('courseId') courseId: string, @Request() req: any): Promise<Chapter[]> {
    const course = await this.coursesService.findCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.chaptersService.findChaptersByCourse(courseId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new NotFoundException('Associated course not found');
    }
    return this.chaptersService.updateChapter(id, updateChapterDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Chapter | null> {
    const chapter = await this.chaptersService.findChapterById(id);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new NotFoundException('Associated course not found');
    }
    return this.chaptersService.deleteChapter(id);
  }
}