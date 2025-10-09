import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    if (createCommentDto.userId !== req.user.uuid) {
      throw new ForbiddenException('You can only create comments for yourself');
    }
    return this.commentsService.createComment(createCommentDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: any) {
    const comment = await this.commentsService.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== req.user.uuid) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.commentsService.deleteComment(id);
  }
}