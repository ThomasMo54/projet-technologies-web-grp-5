import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './quiz.schema';
import { ChaptersService } from '../chapters/chapters.service';
import { CoursesService } from '../courses/courses.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createQuizDto: CreateQuizDto, @Request() req: any): Promise<Quiz> {
    // Vérifier que l'utilisateur est le créateur du cours associé
    const chapter = await this.chaptersService.findChapterById(createQuizDto.chapterId);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Quiz[]> {
    return this.quizzesService.findAllQuizzes();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new ForbiddenException('Quiz not found');
    }
    const chapter = await this.chaptersService.findChapterById(quiz.chapterId);
    if (!chapter) {
      throw new ForbiddenException('Associated chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    return quiz;
  }

  @Get('chapter/:chapterId')
  @UseGuards(AuthGuard('jwt'))
  async findByChapter(@Param('chapterId') chapterId: string, @Request() req: any): Promise<Quiz[]> {
    const chapter = await this.chaptersService.findChapterById(chapterId);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    return this.quizzesService.findQuizzesByChapter(chapterId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new ForbiddenException('Quiz not found');
    }
    const chapter = await this.chaptersService.findChapterById(quiz.chapterId);
    if (!chapter) {
      throw new ForbiddenException('Associated chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new ForbiddenException('Quiz not found');
    }
    const chapter = await this.chaptersService.findChapterById(quiz.chapterId);
    if (!chapter) {
      throw new ForbiddenException('Associated chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    return this.quizzesService.deleteQuiz(id);
  }
}