import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.schema';
import { AuthGuard } from '@nestjs/passport';
import { AddRemoveStudentsDto } from "./dto/add-remove-students.dto";
import { Chapter } from "../chapters/chapter.schema";
import { Comment } from "../comments/comment.schema";

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req: any): Promise<Course> {
    if (req.user.uuid !== createCourseDto.creatorId) {
      throw new ForbiddenException('You are not allowed to create a course for another user');
    }
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAllCourses();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access this course');
    }
    return course;
  }

  @Get('tag/:tag')
  @UseGuards(AuthGuard('jwt'))
  async findByTag(@Param('tag') tag: string): Promise<Course[]> {
    return this.coursesService.findCoursesByTag(tag);
  }

  @Get('creator/:creatorId')
  @UseGuards(AuthGuard('jwt'))
  async findByCreator(@Param('creatorId') creatorId: string): Promise<Course[]> {
    return this.coursesService.findCoursesByCreator(creatorId);
  }

  @Get('student/:studentId')
  @UseGuards(AuthGuard('jwt'))
  async findByStudent(@Param('studentId') studentId: string, @Request() req: any): Promise<Course[]> {
    return this.coursesService.findCoursesByStudent(studentId);
  }

  @Get(':id/chapters')
  @UseGuards(AuthGuard('jwt'))
  async findChapters(@Param('id') id: string): Promise<Chapter[]> {
    return this.coursesService.findChaptersOfCourse(id);
  }

  @Get(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  async findComments(@Param('id') id: string): Promise<Comment[]> {
    return this.coursesService.findCommentsOfCourse(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Put(':id/enroll')
  @UseGuards(AuthGuard('jwt'))
  async addStudents(@Param('id') id: string, @Body() addStudentsDto: AddRemoveStudentsDto, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (course?.creatorId !== req.user.uuid && addStudentsDto.students?.some(studentId => studentId !== req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to enroll students in this course');
    }
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.coursesService.addUsersToCourse(id, addStudentsDto.students ?? []);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.creatorId !== req.user.uuid) {
      throw new ForbiddenException('You are not allowed to delete this course');
    }
    return this.coursesService.deleteCourse(id);
  }

  @Delete(':id/unenroll')
  @UseGuards(AuthGuard('jwt'))
  async removeStudents(@Param('id') id: string, @Body() removeStudentsDto: AddRemoveStudentsDto, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (course?.creatorId !== req.user.uuid && removeStudentsDto.students?.some(studentId => studentId !== req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to unenroll students from this course');
    }
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.coursesService.removeUsersFromCourse(id, removeStudentsDto.students ?? []);
  }

  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'))
  async getStats(@Param('id') id: string, @Request() req: any): Promise<any[]> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    // Vérif auth: creator ou étudiant
    if (course.creatorId !== req.user.uuid && !course.students.includes(req.user.uuid)) {
      throw new ForbiddenException('You are not allowed to access these stats');
    }
    return this.coursesService.getCourseStats(id);
  }
}