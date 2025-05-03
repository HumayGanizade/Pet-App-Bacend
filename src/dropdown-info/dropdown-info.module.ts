import { Module } from '@nestjs/common';
import { DropdownInfoController } from './dropdown-info.controller';
import { DropdownInfoService } from './dropdown-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PetEntity,
      BreedEntity,
      CountryEntity,
      CityEntity,
    ]),
  ],
  controllers: [DropdownInfoController],
  providers: [DropdownInfoService],
})
export class DropdownInfoModule {}
