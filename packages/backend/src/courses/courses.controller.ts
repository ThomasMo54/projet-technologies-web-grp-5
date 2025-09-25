import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req: any): Promise<Course> {
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
      throw new ForbiddenException('Course not found');
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

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Get('student/:studentId')
  @UseGuards(AuthGuard('jwt'))
  async findByStudent(@Param('studentId') studentId: string, @Request() req: any): Promise<Course[]> {
    return this.coursesService.findCoursesByStudent(studentId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Request() req: any): Promise<Course | null> {
    const course = await this.coursesService.findCourseById(id);
    if (!course) {
      throw new ForbiddenException('Course not found');
    }
    // commenter pour l'instant afin de pouvoir tester avec Postman (la meme chose pour les autres modules...)
    //if (course.creatorId !== req.user.uuid) {
    //  throw new ForbiddenException('You are not allowed to delete this course');
    //}
    return this.coursesService.deleteCourse(id);
  }
}