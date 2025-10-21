import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter, ChapterSchema } from './chapter.schema';
import { CoursesModule } from '../courses/courses.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { OllamaModule } from "../ollama/ollama.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    forwardRef(() => QuizzesModule),
    forwardRef(() => CoursesModule),
    OllamaModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}