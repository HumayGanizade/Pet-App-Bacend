import { Module } from '@nestjs/common';
import { SavedEventController } from './saved-event.controller';
import { SavedEventService } from './saved-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { UserEntity } from '../typeorm/entities/user.entity';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { EventEntity } from '../typeorm/entities/event.entity';

@Module({
  controllers: [SavedEventController],
  providers: [SavedEventService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EventEntity,
      RescueAnimalEventEntity,
      LostAnimalEventEntity,
    ]),
  ],
})
export class SavedEventModule {}
