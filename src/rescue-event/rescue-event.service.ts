import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { RescueEventDto } from './dto/rescue-event.dto';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';

@Injectable()
export class RescueEventService {
  constructor(
    @InjectRepository(RescueAnimalEventEntity)
    private rescueAnimalEventRepo: Repository<RescueAnimalEventEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(PetEntity)
    private petRepo: Repository<PetEntity>,
    @InjectRepository(BreedEntity)
    private breedRepo: Repository<BreedEntity>,
    @InjectRepository(CountryEntity)
    private countryRepo: Repository<CountryEntity>,
    @InjectRepository(CityEntity)
    private cityRepo: Repository<CityEntity>,
  ) {}

  async getAll() {
    return await this.rescueAnimalEventRepo.find();
  }

  async getById(id: string) {
    return await this.rescueAnimalEventRepo.findOne({ where: { id: id } });
  }

  async getAllByUserId(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException(
        'user with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const REvents = await this.rescueAnimalEventRepo.find({
      where: { user: user },
      order: { createdAt: 'DESC' },
    });
    if (REvents.length === 0) {
      return 'no events were found';
    } else return REvents;
  }

  async create(id: string, dto: RescueEventDto) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    const pet = await this.petRepo.findOne({ where: { id: dto.petId } });
    if (!pet) {
      throw new HttpException(
        'pet with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const breed = await this.breedRepo.findOne({ where: { id: dto.breedId } });
    if (!breed) {
      throw new HttpException(
        'breed with given id was not found',
        HttpStatus.NOT_FOUND,
      );
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
    const newREvent = this.rescueAnimalEventRepo.create(dto);
    newREvent.pet = pet;
    newREvent.breed = breed;
    newREvent.user = user;
    newREvent.country = country;
    newREvent.city = city;
    await this.rescueAnimalEventRepo.save(newREvent);
    return { message: 'event was successfully created' };
  }

  async editById(id, dto: RescueEventDto) {
    const REvent = await this.rescueAnimalEventRepo.findOne({
      where: { id: id },
    });
    if (!REvent) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const pet = await this.petRepo.findOne({ where: { id: dto.petId } });
    if (!pet) {
      throw new HttpException(
        'pet with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const breed = await this.breedRepo.findOne({ where: { id: dto.breedId } });
    if (!breed) {
      throw new HttpException(
        'breed with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    REvent.name = dto.name;
    REvent.age = dto.age;
    REvent.gender = dto.gender;
    REvent.photo = dto.photo;
    REvent.info = dto.info;
    REvent.location = dto.location;
    REvent.contact_number = dto.contact_number;
    REvent.gmail = dto.gmail;

    if (dto.petId !== REvent.pet.id) {
      REvent.pet = pet;
    }
    if (dto.breedId !== REvent.breed.id) {
      REvent.breed = breed;
    }

    await this.rescueAnimalEventRepo.save(REvent);
    return 'event was successfully updated';
  }

  async deleteById(id: string) {
    const REvent = await this.rescueAnimalEventRepo.findOne({
      where: { id: id },
    });
    if (!REvent) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.rescueAnimalEventRepo.remove(REvent);
      return 'event was successfully deleted';
    }
  }
}
