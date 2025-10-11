import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CoursesService } from "../courses/courses.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./comment.schema";
import { Chapter } from "../chapters/chapter.schema";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const course = await this.coursesService.findCourseById(createCommentDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const newComment = new this.commentModel(createCommentDto);
    const savedComment = await newComment.save();

    // Ajouter le commentaire à la liste des commentaires du cours
    await this.coursesService.updateCourse(createCommentDto.courseId, {
      comments: [...(course.comments || []), savedComment.uuid],
    });

    return savedComment;
  }

  async findCommentById(id: string): Promise<Comment | null> {
    return this.commentModel.findOne({ uuid: id }).exec();
  }

  async deleteComment(id: string): Promise<Comment | null> {
    const comment = await this.commentModel.findOne({ uuid: id }).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Supprimer le comentaire du cours associé
    const course = await this.coursesService.findCourseById(comment.courseId);
    if (course) {
      await this.coursesService.updateCourse(comment.courseId, {
        chapters: course.chapters.filter((chapterId) => chapterId !== id),
      });
    }

    return await this.commentModel.findOneAndDelete({ uuid: id }).exec();
  }
}