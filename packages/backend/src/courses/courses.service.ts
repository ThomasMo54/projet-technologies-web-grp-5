import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly usersService: UsersService,
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

  async deleteCourse(id: string): Promise<Course | null> {
    return this.courseModel.findOneAndDelete({ uuid: id }).exec();
  }
}