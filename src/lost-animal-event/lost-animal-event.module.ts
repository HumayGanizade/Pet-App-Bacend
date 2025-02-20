import { Module } from '@nestjs/common';
import { LostAnimalEventController } from './lost-animal-event.controller';
import { LostAnimalEventService } from './lost-animal-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { UserEntity } from '../typeorm/entities/user.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LostAnimalEventEntity,
      UserEntity,
      BreedEntity,
      PetEntity,
    ]),
  ],
  controllers: [LostAnimalEventController],
  providers: [LostAnimalEventService],
})
export class LostAnimalEventModule {}
