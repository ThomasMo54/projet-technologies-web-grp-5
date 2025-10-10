import { Controller } from "@nestjs/common";
import { QuizAnswersService } from "./quiz-answers.service";

@Controller('quiz-answers')
export class QuizAnswersController {
  constructor(
    private readonly quizAnswersService: QuizAnswersService,
  ) {}


}