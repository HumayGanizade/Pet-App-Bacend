import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../typeorm/entities/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { EventEntity } from '../typeorm/entities/event.entity';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  async create(id, userId, dto: CreateCommentDto, eventTypeId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const newCommentObject = { start: dto.stars, text: dto.text };
    if (eventTypeId === 1) {
      const event = await this.eventRepo.findOne({ where: { id: id } });
      if (!event) {
        throw new HttpException(
          'event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = await this.commentRepo.create(newCommentObject);
      newComment.user = user;
      newComment.event = event;
      await this.commentRepo.save(newComment);
    } else if (eventTypeId === 2) {
      const rescueEvent = await this.rescueAnimalEventRepo.findOne({
        where: { id: id },
      });
      if (rescueEvent) {
        throw new HttpException(
          'rescue event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = await this.commentRepo.create(newCommentObject);
      newComment.user = user;
      newComment.rescue_animal_event = rescueEvent;
      await this.commentRepo.save(newComment);
    } else {
      const LAEvent = await this.lostAnimalEventRepo.findOne({
        where: { id: id },
      });
      if (!LAEvent) {
        throw new HttpException(
          'lost animal event with given id was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const newComment = await this.commentRepo.create(dto);
      newComment.user = user;
      newComment.lost_animal_event = LAEvent;
      await this.commentRepo.save(newComment);
      return 'comment was successfully created';
    }
  }

  async edit(id, userId, dto) {
    const comment = await this.commentRepo.findOne({ where: { id: id } });
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
    comment.stars = dto.stars;
    comment.text = dto.text;
    await this.commentRepo.save(comment);
    return 'comment was successfully edited';
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({ where: { id: id } });
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
    await this.commentRepo.delete(comment);
    return 'comment was successfully deleted';
  }
}
