import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './course.schema';
import { UsersModule } from '../users/users.module';
import { ChaptersModule } from "../chapters/chapters.module";
import { CommentsModule } from "../comments/comments.module";
import { QuizzesModule } from '../quizzes/quizzes.module';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => ChaptersModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => QuizzesModule),
  ],
  controllers: [CoursesController], // Vérifie que CoursesController est ici
  providers: [CoursesService], // Vérifie que CoursesService est ici
  exports: [CoursesService],
})
export class CoursesModule {}