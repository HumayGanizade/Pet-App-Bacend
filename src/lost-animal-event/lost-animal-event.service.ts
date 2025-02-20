import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { CreateLostAnimalEventDto } from './dto/create-lost-animal-event.dto';

@Injectable()
export class LostAnimalEventService {
  constructor(
    @InjectRepository(LostAnimalEventEntity)
    private lostAnimalEventRepo: Repository<LostAnimalEventEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(BreedEntity)
    private breedRepo: Repository<BreedEntity>,
    @InjectRepository(PetEntity)
    private petRepo: Repository<PetEntity>,
  ) {}

  async getAll() {
    return await this.lostAnimalEventRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getById(id: string) {
    const LOEvent = await this.lostAnimalEventRepo.findOne({
      where: { id: id },
    });
    if (!LOEvent) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    } else return LOEvent;
  }

  async getAllByUserId(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException(
        'user with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const userEvents = await this.lostAnimalEventRepo.find({
      where: { user: user },
      order: {
        createdAt: 'DESC',
      },
    });
    if (userEvents.length === 0) {
      return 'no events found';
    } else {
      return userEvents;
    }
  }

  async create(dto: CreateLostAnimalEventDto, id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });

    const pet = await this.petRepo.findOne({ where: { id: dto.petId } });
    if (!pet) {
      throw new HttpException('no pet with given id', HttpStatus.NOT_FOUND);
    }
    const breed = await this.breedRepo.findOne({ where: { id: dto.breedId } });
    if (!breed) {
      throw new HttpException('no breed with given id', HttpStatus.NOT_FOUND);
    }
    const newLOEvent = await this.lostAnimalEventRepo.create(dto);
    newLOEvent.user = user;
    newLOEvent.pet = pet;
    newLOEvent.breed = breed;
    await this.lostAnimalEventRepo.save(newLOEvent);
    return 'event was successfully created';
  }

  async editById(dto: CreateLostAnimalEventDto, id: string) {
    const LOEvent = await this.lostAnimalEventRepo.findOne({
      where: { id: id },
    });
    if (!LOEvent) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const pet = await this.petRepo.findOne({ where: { id: dto.petId } });
    if (!pet) {
      throw new HttpException('no pet with given id', HttpStatus.NOT_FOUND);
    }
    const breed = await this.breedRepo.findOne({ where: { id: dto.breedId } });
    if (!breed) {
      throw new HttpException('no breed with given id', HttpStatus.NOT_FOUND);
    }

    LOEvent.name = dto.name;
    LOEvent.age = dto.age;
    LOEvent.gender = dto.gender;
    LOEvent.photo = dto.photo;
    LOEvent.info = dto.info;
    LOEvent.reward = dto.reward;
    LOEvent.location = dto.location;
    LOEvent.date = dto.date;
    LOEvent.contact_number = dto.contact_number;
    LOEvent.gmail = dto.gmail;

    if (LOEvent.pet.id !== dto.petId) {
      LOEvent.pet = await this.petRepo.findOne({ where: { id: dto.petId } });
    }
    if (LOEvent.breed.id !== dto.petId) {
      LOEvent.breed = await this.breedRepo.findOne({
        where: { id: dto.breedId },
      });
    }
    await this.lostAnimalEventRepo.save(LOEvent);
    return 'event was successfully updated';
  }

  async deleteById(id: string) {
    const LOEvent = await this.lostAnimalEventRepo.findOne({
      where: { id: id },
    });
    if (!LOEvent) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.lostAnimalEventRepo.remove(LOEvent);
    return 'event was successfully deleted';
  }
}
