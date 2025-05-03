import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { EventEntity } from '../typeorm/entities/event.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EventEntity,
      PetEntity,
      BreedEntity,
      CountryEntity,
      CityEntity,
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
