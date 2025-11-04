import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz } from './quiz.schema';
import { AuthGuard } from '@nestjs/passport';
import { QuizAnswer } from "./quiz-answer.schema";
import { CreateQuizAnswerDto } from "./dto/create-quiz-answer.dto";
import { UserTypes } from "../users/type/user-type.decorator";
import { UserType } from "../users/type/user-type.enum";


@Controller('quizzes')
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
  ) {}

  @Post()
  @UserTypes(UserType.TEACHER)
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createQuizDto: CreateQuizDto, @Request() req: any): Promise<Quiz> {
    if (req.user.uuid !== createQuizDto.creatorId) {
      throw new NotFoundException('You are not allowed to create a quiz for another user');
    }
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Post(':id/answers')
  @UseGuards(AuthGuard('jwt'))
  async createAnswer(@Param('id') id: string, @Body() createQuizAnswerDto: CreateQuizAnswerDto): Promise<QuizAnswer> {
    if (id !== createQuizAnswerDto.quizId) {
      throw new NotFoundException('Quiz ID in the URL does not match the body');
    }
    return await this.quizzesService.submitQuizAnswer(createQuizAnswerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Quiz[]> {
    return this.quizzesService.findAllQuizzes();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  @Get(':id/answers/:userId')
  @UseGuards(AuthGuard('jwt'))
  async findUserAnswer(@Param('id') id: string, @Param('userId') userId: string): Promise<QuizAnswer | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return await this.quizzesService.findUserQuizAnswer(id, userId);
  }

  @Get(':id/answers')
  @UseGuards(AuthGuard('jwt'))
  async findAllAnswers(@Param('id') id: string): Promise<QuizAnswer[]> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return await this.quizzesService.findAllAnswersForQuiz(id);
  }

  @Put(':id')
  @UserTypes(UserType.TEACHER)
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    if (quiz.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You are not allowed to update this quiz');
    }
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  @UserTypes(UserType.TEACHER)
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Quiz | null> {
    const quiz = await this.quizzesService.findQuizById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    if (quiz.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You are not allowed to delete this quiz');
    }
    return this.quizzesService.deleteQuiz(id);
  }
}