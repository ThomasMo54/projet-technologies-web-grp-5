import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuizAnswer } from "./quiz-answer.schema";
import { QuizzesService } from "../quizzes.service";
import { CreateQuizAnswerDto } from "./dto/create-quiz-answer.dto";

@Injectable()
export class QuizAnswersService {
  constructor(
    @InjectModel(QuizAnswer.name) private readonly quizAnswerModel: Model<QuizAnswer>,
    @Inject(forwardRef(() => QuizzesService)) private readonly quizzesService: QuizzesService,
  ) {}

  async submitQuizAnswer(createQuizAnswerDto: CreateQuizAnswerDto): Promise<QuizAnswer> {
    // Récupérer le quiz pour vérifier les réponses
    const quiz = await this.quizzesService.findQuizById(createQuizAnswerDto.quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    // Calculer le score
    let score = quiz.questions.filter((question, index) => question.correctOption === createQuizAnswerDto.answers[index]).length;
    // Enregistrer la réponse
    const newQuizAnswer = new this.quizAnswerModel({ ...createQuizAnswerDto, score });
    return newQuizAnswer.save();
  }
}
