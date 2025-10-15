import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz, QuizSchema } from './quiz.schema';
import { ChaptersModule } from '../chapters/chapters.module';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { QuizAnswer, QuizAnswerSchema } from "./quiz-answer.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizAnswer.name, schema: QuizAnswerSchema }
    ]),
    forwardRef(() => ChaptersModule),
    forwardRef(() => CoursesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [
    QuizzesService,
    MongooseModule, // Add this line to export the models
  ],
})
export class QuizzesModule {}