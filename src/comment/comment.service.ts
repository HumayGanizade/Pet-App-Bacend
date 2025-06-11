import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../typeorm/entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { EventEntity } from '../typeorm/entities/event.entity';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private eventRepo: Repository<EventEntity>,
    @InjectRepository(RescueAnimalEventEntity)
    private rescueAnimalEventRepo: Repository<RescueAnimalEventEntity>,
    @InjectRepository(LostAnimalEventEntity)
    private lostAnimalEventRepo: Repository<LostAnimalEventEntity>,
  ) {}

  async create(
    eventId: string,
    userId: string,
    dto: CreateCommentDto,
    eventTypeId: number,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const newCommentObject = { text: dto.text };
    if (Number(eventTypeId) === 1) {
      const event = await this.eventRepo.findOne({ where: { id: eventId } });
      if (!event) {
        throw new HttpException(
          'event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = this.commentRepo.create(newCommentObject);
      newComment.user = user;
      newComment.event = event;
      await this.commentRepo.save(newComment);
    } else if (Number(eventTypeId) === 2) {
      const rescueEvent = await this.rescueAnimalEventRepo.findOne({
        where: { id: eventId },
      });
      if (!eventTypeId) {
        throw new HttpException(
          'rescue event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = this.commentRepo.create(newCommentObject);
      newComment.user = user;
      newComment.rescue_animal_event = rescueEvent;
      await this.commentRepo.save(newComment);
    } else {
      const LAEvent = await this.lostAnimalEventRepo.findOne({
        where: { id: eventId },
      });
      if (!LAEvent) {
        throw new HttpException(
          'lost animal event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = this.commentRepo.create(dto);
      newComment.user = user;
      newComment.lost_animal_event = LAEvent;
      await this.commentRepo.save(newComment);
      return { message: 'comment was successfully created' };
    }
  }

  async createReplyToComment(
    commentId: string,
    dto: CreateCommentDto,
    userId: string,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException(
        'comment with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const replyObject = {
        text: dto.text,
        parent: dto,
        user: user,
      };
      const newComment = this.commentRepo.create(replyObject);
      newComment.user = comment.user;
      await this.commentRepo.save(newComment);
      return { message: 'comment was successfully created' };
    }
  }

  async getCommentsByEventType(eventId: string, eventTypeId: number) {
    if (
      Number(eventTypeId) !== 1 &&
      Number(eventTypeId) !== 2 &&
      Number(eventTypeId) !== 3
    ) {
      throw new HttpException(
        'event type with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (Number(eventTypeId) === 1) {
      const event = await this.eventRepo.findOne({ where: { id: eventId } });
      if (!event) {
        throw new HttpException(
          'event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.commentRepo.find({
        where: {
          event: { id: event.id },
          lost_animal_event: IsNull(),
          rescue_animal_event: IsNull(),
        },
        relations: ['user', 'event'],
      });
    } else if (Number(eventTypeId) === 2) {
      const event = await this.rescueAnimalEventRepo.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new HttpException(
          'rescue event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.commentRepo.find({
        where: {
          event: IsNull(),
          lost_animal_event: IsNull(),
          rescue_animal_event: { id: event.id },
        },
        relations: ['user', 'rescue_animal_event'],
      });
    } else {
      const event = await this.lostAnimalEventRepo.findOne({
        where: { id: eventId },
      });
      if (!event) {
        throw new HttpException(
          'lost animal event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.commentRepo.find({
        where: {
          event: IsNull(),
          lost_animal_event: { id: event.id },
          rescue_animal_event: IsNull(),
        },
        relations: ['user', 'lost_animal_event'],
      });
    }
  }

  async getRepliesOfComment(commentId: string) {
    const parentComment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return await this.commentRepo.find({
      where: { parent: { id: commentId } },
      relations: ['user'],
    });
  }

  async edit(id: string, userId: string, dto: EditCommentDto) {
    const comment = await this.commentRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException(
        'comment with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (comment.user.id !== userId) {
      throw new HttpException(
        'you can edit only your comment',
        HttpStatus.CONFLICT,
      );
    }
    comment.text = dto.text;
    await this.commentRepo.save(comment);
    return { message: 'comment was successfully edited' };
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!comment) {
      throw new HttpException(
        'comment with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (comment.user.id !== userId) {
      throw new HttpException(
        'you can delete only your comment',
        HttpStatus.CONFLICT,
      );
    }
    await this.commentRepo.delete(id);
    return { message: 'comment was successfully deleted' };
  }
}
