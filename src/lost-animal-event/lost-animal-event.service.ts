import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { CreateLostAnimalEventDto } from './dto/create-lost-animal-event.dto';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';
import { PetColorEntity } from '../typeorm/entities/pet-color.entity';

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
    @InjectRepository(CountryEntity)
    private countryRepo: Repository<CountryEntity>,
    @InjectRepository(CityEntity)
    private cityRepo: Repository<CityEntity>,
    @InjectRepository(PetColorEntity)
    private petColorRepo: Repository<PetColorEntity>,
  ) {}

  async getAll(filter: {
    minAge?: number;
    maxAge?: number;
    gender?: string;
    colorId?: string;
    petId?: string;
    breedIds?: string[];
    countryId?: string;
    cityId?: string;
    name?: string;
  }) {
    const qb = this.lostAnimalEventRepo
      .createQueryBuilder('lostAnimalEvent')
      .leftJoin('lostAnimalEvent.pet', 'pet')
      .leftJoin('lostAnimalEvent.breed', 'breed')
      .leftJoin('lostAnimalEvent.country', 'country')
      .leftJoin('lostAnimalEvent.city', 'city');

    if (filter.maxAge < filter.minAge) {
      filter.maxAge = filter.minAge;
    }

    if (filter.name) {
      qb.andWhere('lostAnimalEvent.name LIKE :name', {
        name: `${filter.name}%`,
      });
    }

    if (filter.minAge !== undefined) {
      qb.andWhere('lostAnimalEvent.age >= :minAge', { minAge: filter.minAge });
    }

    if (filter.maxAge !== undefined) {
      qb.andWhere('lostAnimalEvent.age <= :maxAge', { maxAge: filter.maxAge });
    }

    if (filter.gender !== undefined) {
      qb.andWhere('lostAnimalEvent.gender = :gender', {
        gender: filter.gender,
      });
    }

    if (filter.colorId !== undefined) {
      qb.andWhere('lostAnimalEvent.color = :color', { gender: filter.gender });
    }

    if (Array.isArray(filter.breedIds) && filter.breedIds.length > 0) {
      qb.andWhere('breed.id IN (:...breedIds)', { breedIds: filter.breedIds });
    }

    if (filter.petId !== undefined) {
      qb.andWhere('pet.id = :petId', { petId: filter.petId });
    }

    if (filter.countryId !== undefined) {
      qb.andWhere('country.id = :countryId', { countryId: filter.countryId });
    }

    if (filter.cityId !== undefined) {
      qb.andWhere('city.id = :cityId', { cityId: filter.cityId });
    }
    qb.orderBy('lostAnimalEvent.createdAt', 'DESC');
    return qb.getMany();
  }

  async getById(id: string) {
    const LOEvent = await this.lostAnimalEventRepo.findOne({
      where: { id: id },
      relations: ['country', 'city', 'pet', 'breed', 'color'],
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
      where: { user: { id: id } },
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

    const country = await this.countryRepo.findOne({
      where: { id: dto.countryId },
    });
    if (!country) {
      throw new HttpException(
        'country with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const city = await this.cityRepo.findOne({
      where: { id: dto.cityId },
    });
    if (!city) {
      throw new HttpException(
        'city with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const color = await this.petColorRepo.findOne({
      where: { id: dto.colorId },
    });
    if (!color) {
      throw new HttpException(
        'color with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const newLOEvent = this.lostAnimalEventRepo.create(dto);
    newLOEvent.user = user;
    newLOEvent.pet = pet;
    newLOEvent.breed = breed;
    newLOEvent.country = country;
    newLOEvent.city = city;
    newLOEvent.color = color;

    await this.lostAnimalEventRepo.save(newLOEvent);
    return { message: 'event was successfully created' };
  }

  async editById(dto: CreateLostAnimalEventDto, id: string) {
    const LOEvent = await this.lostAnimalEventRepo.findOne({
      where: { id: id },
      relations: ['country', 'city', 'pet', 'breed', 'color'],
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
    return { message: 'event was successfully updated' };
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
    return { message: 'event was successfully deleted' };
  }

  async getColors() {
    const colors = await this.petColorRepo.find();
    if (colors.length === 0) {
      return 'no colors were found';
    } else return colors;
  }
}
