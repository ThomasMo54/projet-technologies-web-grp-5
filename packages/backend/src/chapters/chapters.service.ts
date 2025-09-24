import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from './chapter.schema';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    private readonly coursesService: CoursesService,
  ) {}

  async createChapter(createChapterDto: CreateChapterDto): Promise<Chapter> {
    // Vérifier si le courseId existe
    const course = await this.coursesService.findCourseById(createChapterDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Vérifier si un chapitre avec le même titre existe dans le même cours
    const existingChapter = await this.chapterModel
      .findOne({ title: createChapterDto.title, courseId: createChapterDto.courseId })
      .exec();
    if (existingChapter) {
      throw new ConflictException('Chapter with this title already exists in this course');
    }

    const newChapter = new this.chapterModel(createChapterDto);
    const savedChapter = await newChapter.save();

    // Ajouter le chapitre à la liste des chapitres du cours
    await this.coursesService.updateCourse(createChapterDto.courseId, {
      chapters: [...(course.chapters || []), savedChapter.uuid],
    });

    return savedChapter;
  }

  async findChapterById(id: string): Promise<Chapter | null> {
    return this.chapterModel.findOne({ uuid: id }).exec();
  }

  async findAllChapters(): Promise<Chapter[]> {
    return this.chapterModel.find().exec();
  }

  async findChaptersByCourse(courseId: string): Promise<Chapter[]> {
    // Vérifier si le courseId existe
    const course = await this.coursesService.findCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.chapterModel.find({ courseId }).exec();
  }

  async updateChapter(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter | null> {
    // Vérifier si le courseId existe (si fourni)
    if (updateChapterDto.courseId) {
      const course = await this.coursesService.findCourseById(updateChapterDto.courseId);
      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    // Vérifier si un autre chapitre avec le même titre existe dans le même cours (si titre et courseId sont fournis)
    if (updateChapterDto.title && updateChapterDto.courseId) {
      const existingChapter = await this.chapterModel
        .findOne({
          title: updateChapterDto.title,
          courseId: updateChapterDto.courseId,
          uuid: { $ne: id },
        })
        .exec();
      if (existingChapter) {
        throw new ConflictException('Chapter with this title already exists in this course');
      }
    }

    return this.chapterModel.findOneAndUpdate({ uuid: id }, updateChapterDto, { new: true }).exec();
  }

  async deleteChapter(id: string): Promise<Chapter | null> {
    const chapter = await this.chapterModel.findOne({ uuid: id }).exec();
    if (!chapter) {
      return null;
    }

    // Supprimer le chapitre de la liste des chapitres du cours
    const course = await this.coursesService.findCourseById(chapter.courseId);
    if (course) {
      await this.coursesService.updateCourse(chapter.courseId, {
        chapters: course.chapters.filter((chapterId) => chapterId !== id),
      });
    }

    return this.chapterModel.findOneAndDelete({ uuid: id }).exec();
  }
}