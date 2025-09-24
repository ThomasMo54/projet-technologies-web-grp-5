import { Controller, Get, Post, Put, Delete, Body, Param, Request, ForbiddenException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './quiz.schema';
import { ChaptersService } from '../chapters/chapters.service';
import { CoursesService } from '../courses/courses.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
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
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Get()
  async findAll(): Promise<Quiz[]> {
    return this.quizzesService.findAllQuizzes();
  }

  @Get(':id')
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
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access this quiz');
    }
    return quiz;
  }

  @Get('chapter/:chapterId')
  async findByChapter(@Param('chapterId') chapterId: string, @Request() req: any): Promise<Quiz[]> {
    const chapter = await this.chaptersService.findChapterById(chapterId);
    if (!chapter) {
      throw new ForbiddenException('Chapter not found');
    }
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new ForbiddenException('Associated course not found');
    }
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access this course');
    }
    return this.quizzesService.findQuizzesByChapter(chapterId);
  }

  @Put(':id')
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
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only update quizzes for your own courses');
    }
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
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
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You can only delete quizzes for your own courses');
    }
    return this.quizzesService.deleteQuiz(id);
  }
}