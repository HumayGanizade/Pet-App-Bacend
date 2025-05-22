import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { Repository } from 'typeorm';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { PetColorEntity } from '../typeorm/entities/pet-color.entity';

@Injectable()
export class DropdownInfoService {
  constructor(
    @InjectRepository(PetEntity) private petRepo: Repository<PetEntity>,
    @InjectRepository(BreedEntity) private breedRepo: Repository<BreedEntity>,
    @InjectRepository(CountryEntity)
    private countryRepo: Repository<CountryEntity>,
    @InjectRepository(CityEntity) private cityRepo: Repository<CityEntity>,
    @InjectRepository(PetColorEntity)
    private petColorRepo: Repository<PetColorEntity>,
  ) {}

  async createPet(body) {
    const pet = this.petRepo.create({ name: body.name });
    return this.petRepo.save(pet);
  }

  async getAllPets() {
    return await this.petRepo.find({ select: { id: true, name: true } });
  }

  async createBreedByPetId(id: string, body: { name: string }) {
    const pet = await this.petRepo.findOne({ where: { id: id } });
    const newBreed = await this.breedRepo.create(body);
    newBreed.pet = pet;
    await this.breedRepo.save(newBreed);
    return 'breed was successfully created';
  }

  async getAllBreedsByPetId(id: string) {
    const pet = await this.petRepo.findOne({ where: { id: id } });
    return await this.breedRepo.find({
      where: { pet: pet },
      select: { id: true, name: true },
    });
  }

  async getEventTypes() {
    return [{ name: 'online' }, { name: 'offline' }];
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

  async createCountry(body) {
    const country = this.countryRepo.create({ name: body.name });
    return this.countryRepo.save(country);
  }

  async createCity({ name, countryId }: { name: string; countryId: string }) {
    const country = await this.countryRepo.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    const city = this.cityRepo.create({ name });
    city.country = country;
    return this.cityRepo.save(city);
  }

  async getAllCountries() {
    return await this.countryRepo.find();
  }

  async getAllPetColors() {
    return await this.petColorRepo.find();
  }

  async getAllCitiesByCountryId(id: string) {
    const country = await this.countryRepo.findOne({ where: { id: id } });
    if (!country) {
      throw new HttpException(
        'country with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.cityRepo.find({ where: { country: country } });
  }
}
