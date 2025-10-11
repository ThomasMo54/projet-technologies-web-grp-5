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
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: QuizAnswer.name, schema: QuizAnswerSchema }]),
    forwardRef(() => ChaptersModule),
    forwardRef(() => CoursesModule),
    UsersModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}