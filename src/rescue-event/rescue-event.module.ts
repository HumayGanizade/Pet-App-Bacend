import { Module } from '@nestjs/common';
import { RescueEventController } from './rescue-event.controller';
import { RescueEventService } from './rescue-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { UserEntity } from '../typeorm/entities/user.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';
import { PetColorEntity } from '../typeorm/entities/pet-color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RescueAnimalEventEntity,
      UserEntity,
      PetEntity,
      BreedEntity,
      CountryEntity,
      CityEntity,
      PetColorEntity,
    ]),
  ],
  controllers: [RescueEventController],
  providers: [RescueEventService],
})
export class RescueEventModule {}
