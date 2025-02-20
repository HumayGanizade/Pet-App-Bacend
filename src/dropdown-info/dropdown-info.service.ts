import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DropdownInfoService {
  constructor(
    @InjectRepository(PetEntity) private petRepo: Repository<PetEntity>,
  ) {}

  async getAllPets() {
    return await this.petRepo.find({ select: { id: true, name: true } });
  }

  async getAllPetsByCategoryId(typeId: number) {
    return await this.petRepo.find({
      where: { type: typeId },
      select: { id: true, name: true },
    });
  }

  async getAllTypes() {
    return [
      { id: 1, name: 'Dogs' },
      { id: 2, name: 'Cats' },
      { id: 3, name: 'Small Pets' },
      { id: 4, name: 'Birds' },
      { id: 5, name: 'Reptiles & Amphibians' },
      { id: 6, name: 'Fish & Aquatic Pets' },
      { id: 7, name: 'Exotic & Unusual Pets' },
    ];
  }
}
