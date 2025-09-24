import { ConflictException, Injectable, ForbiddenException, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './quiz.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ChaptersService } from '../chapters/chapters.service';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @Inject(forwardRef(() => ChaptersService))
    private readonly chaptersService: ChaptersService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    // Vérifier si le creatorId existe
    const creator = await this.usersService.findUserById(createQuizDto.creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérifier si le chapterId existe
    const chapter = await this.chaptersService.findChapterById(createQuizDto.chapterId);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    // Vérifier si le créateur du quiz est le créateur du cours associé
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (!course) {
      throw new NotFoundException('Associated course not found');
    }
    if (course.creatorId !== createQuizDto.creatorId) {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }

    // Vérifier si un quiz avec le même titre existe dans le même chapitre
    const existingQuiz = await this.quizModel
      .findOne({ title: createQuizDto.title, chapterId: createQuizDto.chapterId })
      .exec();
    if (existingQuiz) {
      throw new ConflictException('Quiz with this title already exists in this chapter');
    }

    // Valider les questions
    if (!createQuizDto.questions || createQuizDto.questions.length === 0) {
      throw new BadRequestException('A quiz must have at least one question');
    }
    for (const question of createQuizDto.questions) {
      if (!question.options || question.options.length < 2) {
        throw new BadRequestException('Each question must have at least two options');
      }
      if (
        question.correctOption < 0 ||
        question.correctOption >= question.options.length
      ) {
        throw new BadRequestException('Correct option index is invalid');
      }
    }

    const newQuiz = new this.quizModel(createQuizDto);
    const savedQuiz = await newQuiz.save();

    // Mettre à jour le quizId dans le chapitre
    await this.chaptersService.updateChapter(createQuizDto.chapterId, {
      quizId: savedQuiz.uuid,
    });

    return savedQuiz;
  }

  async findQuizById(id: string): Promise<Quiz | null> {
    return this.quizModel.findOne({ uuid: id }).exec();
  }

  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findQuizzesByChapter(chapterId: string): Promise<Quiz[]> {
    // Vérifier si le chapterId existe
    const chapter = await this.chaptersService.findChapterById(chapterId);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return this.quizModel.find({ chapterId }).exec();
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz | null> {
    // Vérifier si le chapterId existe (si fourni)
    if (updateQuizDto.chapterId) {
      const chapter = await this.chaptersService.findChapterById(updateQuizDto.chapterId);
      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }
    }

    // Vérifier si un autre quiz avec le même titre existe dans le même chapitre (si titre et chapterId sont fournis)
    if (updateQuizDto.title && updateQuizDto.chapterId) {
      const existingQuiz = await this.quizModel
        .findOne({
          title: updateQuizDto.title,
          chapterId: updateQuizDto.chapterId,
          uuid: { $ne: id },
        })
        .exec();
      if (existingQuiz) {
        throw new ConflictException('Quiz with this title already exists in this chapter');
      }
    }

    // Valider les questions (si fournies)
    if (updateQuizDto.questions) {
      if (updateQuizDto.questions.length === 0) {
        throw new BadRequestException('A quiz must have at least one question');
      }
      for (const question of updateQuizDto.questions) {
        if (question.options && question.options.length < 2) {
          throw new BadRequestException('Each question must have at least two options');
        }
        if (
          question.correctOption !== undefined &&
          (question.correctOption < 0 ||
            (question.options && question.correctOption >= question.options.length))
        ) {
          throw new BadRequestException('Correct option index is invalid');
        }
      }
    }

    return this.quizModel.findOneAndUpdate({ uuid: id }, updateQuizDto, { new: true }).exec();
  }

  async deleteQuiz(id: string): Promise<Quiz | null> {
    const quiz = await this.quizModel.findOne({ uuid: id }).exec();
    if (!quiz) {
      return null;
    }

    // Supprimer le quizId du chapitre associé
    const chapter = await this.chaptersService.findChapterById(quiz.chapterId);
    if (chapter && chapter.quizId === id) {
      await this.chaptersService.updateChapter(quiz.chapterId, { quizId: "" });
    }

    return this.quizModel.findOneAndDelete({ uuid: id }).exec();
  }
}