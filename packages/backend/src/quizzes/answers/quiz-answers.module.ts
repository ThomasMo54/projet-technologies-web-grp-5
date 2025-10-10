import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuizzesModule } from "../quizzes.module";
import { QuizAnswer, QuizAnswerSchema } from "./quiz-answer.schema";
import { QuizAnswersController } from "./quiz-answers.controller";
import { QuizAnswersService } from "./quiz-answers.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QuizAnswer.name, schema: QuizAnswerSchema }]),
    forwardRef(() => QuizzesModule),
  ],
  controllers: [QuizAnswersController],
  providers: [QuizAnswersService],
  exports: [QuizAnswersService],
})
export class QuizAnswersModule {}