import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Delete,
  Get,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId/:eventTypeId')
  create(
    @Param('eventId') eventId: string,
    @Param('eventTypeId') eventTypeId: number,
    @Request() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(eventId, req.user.id, dto, eventTypeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  createReplyToComment(
    @Param('id') commentId: string,
    @Request() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createReplyToComment(
      commentId,
      dto,
      req.user.id,
    );
  }

  @Get('getCommentsByEventType/:eventId/:eventTypeId')
  async getCommentsByEventType(
    @Param('eventId') eventId: string,
    @Param('eventTypeId') eventTypeId: number,
  ) {
    return await this.commentService.getCommentsByEventType(
      eventId,
      eventTypeId,
    );
  }

  @Get('getRepliesOfComment/:commentId')
  async getRepliesOfComment(@Param('commentId') commentId: string) {
    return await this.commentService.getRepliesOfComment(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  edit(
    @Param('id') id: string,
    @Body() dto: EditCommentDto,
    @Request() req: any,
  ) {
    return this.commentService.edit(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.commentService.delete(id, req.user.id);
  }
}
