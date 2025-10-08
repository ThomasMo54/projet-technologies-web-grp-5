import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UsersService } from '../users/users.service';
import { UserType } from "../users/user-type.enum";
import { Chapter } from "../chapters/chapter.schema";
import { ChaptersService } from "../chapters/chapters.service";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    @Inject(forwardRef(() => ChaptersService)) private readonly chaptersService: ChaptersService
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    // Vérifier si le creatorId existe dans la collection users
    const creator = await this.usersService.findUserById(createCourseDto.creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Vérifier si un cours avec le même titre existe (pour éviter les doublons)
    const existingCourse = await this.courseModel.findOne({ title: createCourseDto.title }).exec();
    if (existingCourse) {
      throw new ConflictException('Course with this title already exists');
    }

    // Vérifier que tous les students existent (si fournis)
    if (createCourseDto.students && createCourseDto.students.length > 0) {
      for (const studentId of createCourseDto.students) {
        const student = await this.usersService.findUserById(studentId);
        if (!student) {
          throw new NotFoundException(`Student with ID ${studentId} not found`);
        }
      }
    }

    const newCourse = new this.courseModel(createCourseDto);
    return newCourse.save();
  }

  async findCourseById(id: string): Promise<Course | null> {
    return this.courseModel.findOne({ uuid: id }).exec();
  }

  async findAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async findCoursesByTag(tag: string): Promise<Course[]> {
    return this.courseModel.find({ tags: tag }).exec();
  }

  //Recherche des cours par creatorId
  async findCoursesByCreator(creatorId: string): Promise<Course[]> {
    // Vérifier si le creatorId existe
    const creator = await this.usersService.findUserById(creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    return this.courseModel.find({ creatorId }).exec();
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course | null> {
    // Vérifier si le creatorId existe (si fourni dans la mise à jour)
    if (updateCourseDto.creatorId) {
      const creator = await this.usersService.findUserById(updateCourseDto.creatorId);
      if (!creator) {
        throw new NotFoundException('Creator not found');
      }
    }

    // Vérifier que tous les students existent (si fournis dans la mise à jour)
    if (updateCourseDto.students && updateCourseDto.students.length > 0) {
      for (const studentId of updateCourseDto.students) {
        const student = await this.usersService.findUserById(studentId);
        if (!student) {
          throw new NotFoundException(`Student with ID ${studentId} not found`);
        }
      }
    }

    return this.courseModel.findOneAndUpdate({ uuid: id }, updateCourseDto, { new: true }).exec();
  }

  async addUsersToCourse(courseId: string, userIds: string[]): Promise<Course | null> {
    const course = await this.findCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const users: string[] = [];
    for (const id of userIds) {
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.type !== UserType.STUDENT) {
        throw new ForbiddenException('Only students can be added to a course');
      }
      if (course.students.includes(id)) {
        throw new ConflictException('User is already enrolled in this course');
      }
      await this.usersService.enrollUserInCourse(id, courseId);
      users.push(id);
    }
    course.students.push(...users);
    return course.save();
  }

  async removeUsersFromCourse(courseId: string, userIds: string[]): Promise<Course | null> {
    const course = await this.findCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const users: string[] = [];
    for (const id of userIds) {
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!course.students.includes(id)) {
        throw new NotFoundException('User is not enrolled in this course');
      }
      await this.usersService.unenrollUserFromCourse(id, courseId);
      users.push(id);
    }
    course.students = course.students.filter(studentId => !users.includes(studentId));
    return course.save();
  }

  async findCoursesByStudent(studentId: string): Promise<Course[]> {
    // Verify if the user exists and is of type 'student'
    const user = await this.usersService.findUserById(studentId);
    if (!user) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    if (user.type !== 'student') {
      throw new ForbiddenException('User is not a student');
    }

    // Find courses where the studentId is in the students array
    return this.courseModel.find({ students: studentId }).exec();
  }

  async findChaptersOfCourse(courseId: string): Promise<Chapter[]> {
    const course = await this.findCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const chapters: Chapter[] = [];
    for (const chapterId of course.chapters) {
      const chapter = await this.chaptersService.findChapterById(chapterId);
      if (chapter) {
        chapters.push(chapter);
      }
    }
    return chapters;
  }

  async deleteCourse(id: string): Promise<Course | null> {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    // Supprimer les chapitres associés au cours
    for (const chapterId of course.chapters) {
      await this.chaptersService.deleteChapter(chapterId);
    }
    return this.courseModel.findOneAndDelete({ uuid: id }).exec();
  }
}