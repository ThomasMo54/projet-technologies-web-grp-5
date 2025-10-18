import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { CoursesService } from "../courses/courses.service";
import { Course } from "../courses/course.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
  ) {}

  async createUser(email: string, password: string, lastname: string, firstname: string, type: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword, lastname, firstname, type });
    return newUser.save();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ uuid: id }).exec();
    if (!user) {
      throw new NotFoundException('User with this id not found');
    }
    return user;
  }

  async findUserByIdWithoutPassword(id: string): Promise<User | null> {
    const user = this.userModel.findOne({ uuid: id }).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User with this id not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserCourses(id: string): Promise<Course[]> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const courses: Course[] = [];
    for (const courseId of user.courses) {
      const course = await this.coursesService.findCourseById(courseId);
      if (course) {
        courses.push(course);
      }
    }
    return courses;
  }

  async findUserEnrolledCourses(id: string): Promise<Course[]> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const courses: Course[] = [];
    for (const courseId of user.enrolledCourses) {
      const course = await this.coursesService.findCourseById(courseId);
      if (course) {
        courses.push(course);
      }
    }
    return courses;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    // Si un nouveau mot de passe est fourni, le hasher avant la mise à jour
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    return this.userModel.findOneAndUpdate(
      { uuid: id }, 
      updateData, 
      { new: true }
    ).select('-password').exec();
  }

  async enrollUserInCourse(id: string, courseId: string) {
    return this.userModel.findOneAndUpdate({ uuid: id }, { $addToSet: { enrolledCourses: courseId } }, { new: true }).exec();
  }

  async unenrollUserFromCourse(id: string, courseId: string) {
    return this.userModel.findOneAndUpdate({ uuid: id }, { $pull: { enrolledCourses: courseId } }, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ uuid: id }).select('-password').exec();
  }
}