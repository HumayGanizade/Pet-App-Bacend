import { Module } from '@nestjs/common';
import { DropdownInfoController } from './dropdown-info.controller';
import { DropdownInfoService } from './dropdown-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from '../typeorm/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [DropdownInfoController],
  providers: [DropdownInfoService],
})
export class DropdownInfoModule {}
