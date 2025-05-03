import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../typeorm/entities/event.entity';
import { Raw, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UserEntity } from '../typeorm/entities/user.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { DateTime } from 'luxon';
import { EditEventDto } from './dto/edit-event.dto';
import { CountryEntity } from '../typeorm/entities/country.entity';
import { CityEntity } from '../typeorm/entities/city.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity) private eventRepo: Repository<EventEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(PetEntity) private petRepo: Repository<PetEntity>,
    @InjectRepository(BreedEntity) private breedRepo: Repository<BreedEntity>,
    @InjectRepository(CountryEntity)
    private countryRepo: Repository<CountryEntity>,
    @InjectRepository(CityEntity)
    private cityRepo: Repository<CityEntity>,
  ) {}

  async createEvent(dto: CreateEventDto, userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['events'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.eventValidator(dto);
    const newEventObject = {
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      type: dto.type,
      price: dto.price,
      location: dto.location,
      photo: dto.photo,
      info: dto.info,
      plan: dto.plan,
      contact_number: dto.contact_number,
      gmail: dto.gmail,
    };

    const petArray = [];
    if (dto.petsIds.length !== 0) {
      for (const petId of dto.petsIds) {
        const pet = await this.petRepo.findOne({ where: { id: petId } });
        petArray.push(pet);
      }
    }
    const breedArray = [];
    if (dto.breedIds.length !== 0) {
      for (const breedId of dto.breedIds) {
        const breed = await this.breedRepo.findOne({ where: { id: breedId } });
        breedArray.push(breed);
      }
    }
    const newEvent = this.eventRepo.create(newEventObject);
    newEvent.pets = petArray;
    newEvent.breeds = breedArray;
    newEvent.user = user;

    newEvent.country = await this.countryRepo.findOne({
      where: { id: dto.countryId },
    });
    newEvent.city = await this.cityRepo.findOne({
      where: { id: dto.cityId },
    });

    await this.eventRepo.save(newEvent);
    return { message: 'event was successfully created' };
  }

  async editEventById(dto: EditEventDto, id: string) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
    });
    if (!event) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.eventValidator(dto);

    event.name = dto.name;
    event.startDate = dto.startDate;
    event.endDate = dto.endDate;
    event.type = dto.type;
    event.price = dto.price;
    event.location = dto.location;
    event.photo = dto.photo;
    event.info = dto.info;
    event.plan = dto.plan;
    event.contact_number = dto.contact_number;
    event.gmail = dto.gmail;

    event.pets = [];
    for (const petId of dto.petsIds) {
      const pet = await this.petRepo.findOne({ where: { id: petId } });
      event.pets.push(pet);
    }
    event.breeds = [];
    for (const breedId of dto.breedIds) {
      const breed = await this.breedRepo.findOne({
        where: { id: breedId },
      });
      event.breeds.push(breed);
    }

    if (event.country.id !== dto.countryId) {
      event.country = await this.countryRepo.findOne({
        where: { id: dto.countryId },
      });
    }

    if (event.city.id !== dto.cityId) {
      event.city = await this.cityRepo.findOne({
        where: { id: dto.cityId },
      });
    }

    await this.eventRepo.save(event);
    return event;
  }

  async getAllEvents() {
    const now = DateTime.now().setZone('Europe/London').toJSDate();

    const upcomingEvents = await this.eventRepo.find({
      where: {
        endDate: Raw((alias) => `${alias} > :now`, { now }),
      },
    });

    return upcomingEvents.length > 0
      ? upcomingEvents
      : { message: 'No upcoming events found' };
  }

  async getEventById(id: string) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['pets', 'breeds', 'country', 'city'],
    });

    if (!event) {
      throw new HttpException('No event with given ID', HttpStatus.NOT_FOUND);
    }

    return {
      ...event,
      photo: event.photo ? String(event.photo) : null,
    };
  }

  async getAllEventsByUserId(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    const events = await this.eventRepo.find({
      where: { user: { id: user.id } } as any,
    });
    if (events) {
      return events.map((event) => ({
        ...event,
        photo: event.photo ? String(event.photo) : null,
      }));
    } else {
      throw new HttpException('Events were not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteEventById(id: string) {
    const eventToDelete = await this.eventRepo.findOne({ where: { id: id } });
    if (!eventToDelete) {
      throw new HttpException(
        'event with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.eventRepo.remove(eventToDelete);
      return 'event was successfully deleted';
    }
  }

  async eventValidator(dto: CreateEventDto) {
    if (dto.petsIds.length !== 0) {
      const sortedPetIds = dto.petsIds.sort();
      if (sortedPetIds.length !== dto.petsIds.length) {
        throw new HttpException(
          'petsIds error: array should be consist of unique ids.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (dto.breedIds.length !== 0) {
      const sortedBreedIds = dto.breedIds.sort();
      if (sortedBreedIds.length !== dto.breedIds.length) {
        throw new HttpException(
          'breedIds error: array should be consist of unique ids.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    for (const petId of dto.petsIds) {
      const pet = await this.petRepo.findOne({ where: { id: petId } });
      if (!pet) {
        throw new HttpException(
          `petIds error: pet with id ${petId} doesn't exist`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    for (const breedId of dto.breedIds) {
      const breed = await this.breedRepo.findOne({ where: { id: breedId } });
      if (!breed) {
        throw new HttpException(
          `breedIds error: breed with id ${breedId} doesn't exist`,
          HttpStatus.NOT_FOUND,
        );
      }
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
    return true;
  }

  async getFilteredEvents(filters: {
    startDate?: string;
    endDate?: string;
    type?: number;
    minPrice?: number;
    maxPrice?: number;
    countryId?: string;
    cityId?: string;
    petsIds: string[];
    breedIds: string[];
    name?: string;
  }) {
    const query = this.eventRepo.createQueryBuilder('event');
    if (filters.maxPrice < filters.minPrice) {
      filters.maxPrice = filters.minPrice;
    }

    if (filters.name) {
      query.andWhere('event.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.startDate) {
      query.andWhere('event.startDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      query.andWhere('event.endDate <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    if (filters.type) {
      query.andWhere('event.type = :type', { type: filters.type });
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      query.andWhere('event.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      query.andWhere('event.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.countryId) {
      query.andWhere('event.countryId = :countryId', {
        countryId: filters.countryId,
      });
    }
    if (filters.cityId) {
      query.andWhere('event.cityId = :cityId', { cityId: filters.cityId });
    }

    if (filters.petsIds.length > 0) {
      query.innerJoin('event.pets', 'pet').andWhere('pet.id IN (:...petsIds)', {
        petsIds: filters.petsIds,
      });
    }

    if (filters.breedIds.length > 0) {
      query
        .innerJoin('event.breeds', 'breed')
        .andWhere('breed.id IN (:...breedIds)', { breedIds: filters.breedIds });
    }

    const events = await query.getMany();
    const transformedEvents = events.map((event) => ({
      ...event,
      photo: event.photo ? String(event.photo) : null,
    }));
    return transformedEvents.length > 0
      ? transformedEvents
      : { message: 'No matching events found' };
  }
}
