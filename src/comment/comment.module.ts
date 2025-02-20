import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../typeorm/entities/comment.entity';
import { UserEntity } from '../typeorm/entities/user.entity';
import { EventEntity } from '../typeorm/entities/event.entity';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      UserEntity,
      EventEntity,
      RescueAnimalEventEntity,
      LostAnimalEventEntity,
    ]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
