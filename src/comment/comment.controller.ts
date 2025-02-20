import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CreateCommentDto,
    eventTypeId: number,
  ) {
    return this.commentService.create(id, req.user.id, dto, eventTypeId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  edit(@Param('id') id: string, @Body() dto: EditCommentDto, @Request() req) {
    return this.commentService.edit(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.commentService.delete(id, req.user.id);
  }
}
