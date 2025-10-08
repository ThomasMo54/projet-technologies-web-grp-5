import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './course.schema';
import { UsersModule } from '../users/users.module';
import { ChaptersModule } from "../chapters/chapters.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => ChaptersModule),
  ],
  controllers: [CoursesController], // Vérifie que CoursesController est ici
  providers: [CoursesService], // Vérifie que CoursesService est ici
  exports: [CoursesService],
})
export class CoursesModule {}