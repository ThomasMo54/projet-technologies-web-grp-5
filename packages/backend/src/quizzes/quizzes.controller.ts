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
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createQuizDto: CreateQuizDto, @Request() req: any): Promise<Quiz> {
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
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return this.quizzesService.deleteQuiz(id);
  }
}