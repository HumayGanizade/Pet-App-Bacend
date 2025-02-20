import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../typeorm/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UserEntity } from '../typeorm/entities/user.entity';
import { PetEntity } from '../typeorm/entities/pet.entity';
import { BreedEntity } from '../typeorm/entities/breed.entity';
import { Raw } from 'typeorm';
import { DateTime } from 'luxon';
import { EditEventDto } from './dto/edit-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity) private eventRepo: Repository<EventEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(PetEntity) private petRepo: Repository<PetEntity>,
    @InjectRepository(BreedEntity) private breedRepo: Repository<BreedEntity>,
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

    const newEvent = this.eventRepo.create(dto);
    newEvent.user = user;
    if (dto.petsIds.length) {
      for (const petId of dto.petsIds) {
        const pet = await this.petRepo.findOne({ where: { id: petId } });
        newEvent.pets.push(pet);
      }
    }
    if (dto.breedIds.length) {
      for (const breedId of dto.breedIds) {
        const breed = await this.breedRepo.findOne({ where: { id: breedId } });
        newEvent.breeds.push(breed);
      }
    }
    await this.eventRepo.save(newEvent);
    return 'event was successfully created';
  }

  async editEventById(dto: EditEventDto, id: string) {
    const event = await this.eventRepo.findOne({ where: { id: id } });
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

    if (event.allAnimals !== dto.allAnimals) {
      if (dto.allAnimals) {
        event.pets = [];
      } else {
        for (const petId of dto.petsIds) {
          const pet = await this.petRepo.findOne({ where: { id: petId } });
          event.pets.push(pet);
        }
      }
    } else {
      if (!dto.allAnimals) {
        event.pets = [];
        for (const petId of dto.petsIds) {
          const pet = await this.petRepo.findOne({ where: { id: petId } });
          event.pets.push(pet);
        }
      }
    }
    event.allAnimals = dto.allAnimals;

    if (event.allBreeds !== dto.allBreeds) {
      if (dto.allBreeds) {
        event.pets = [];
      } else {
        for (const breedId of dto.breedIds) {
          const breed = await this.breedRepo.findOne({
            where: { id: breedId },
          });
          event.breeds.push(breed);
        }
      }
    } else {
      if (!dto.allBreeds) {
        event.breeds = [];
        for (const breedId of dto.breedIds) {
          const breed = await this.breedRepo.findOne({
            where: { id: breedId },
          });
          event.breeds.push(breed);
        }
      }
      event.allBreeds = dto.allBreeds;
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

  async getAllEventsByUserId(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    const events = await this.eventRepo.find({ where: { user: user } });
    if (events) {
      return events;
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
    const sortedPetsIds = dto.petsIds.sort();
    if (sortedPetsIds.length !== dto.petsIds.length) {
      throw new HttpException(
        'petsIds error: array should be consist of unique ids.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sortedBreedIds = dto.petsIds.sort();
    if (sortedBreedIds.length !== dto.breedIds.length) {
      throw new HttpException(
        'breedIds error: array should be consist of unique ids.',
        HttpStatus.BAD_REQUEST,
      );
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

    if (dto.allAnimals) {
      if (dto.petsIds.length !== 0) {
        throw new HttpException(
          'if allAnimals if true, petsIds should be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (dto.petsIds.length === 0) {
        throw new HttpException(
          'if allAnimals if false, petsIds should not be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (dto.allBreeds) {
      if (dto.breedIds.length !== 0) {
        throw new HttpException(
          'if allBreeds if true, breedIds should be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (dto.petsIds.length === 0) {
        throw new HttpException(
          'if allBreeds if false, breedIds should not be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
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
    allAnimals?: boolean;
    animalIds?: string[];
    allBreeds?: boolean;
    breedIds?: string[];
  }) {
    const query = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.country', 'country')
      .leftJoinAndSelect('event.city', 'city')
      .leftJoinAndSelect('event.pets', 'pets')
      .leftJoinAndSelect('event.breeds', 'breeds')
      .where('event.endDate > :now', { now: new Date() });

    // 🕒 Filter by start and end date range
    if (filters.startDate) {
      query.andWhere('event.startDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      query.andWhere('event.endDate <= :endDate', { endDate: filters.endDate });
    }

    // 🎭 Filter by event type
    if (filters.type !== undefined) {
      query.andWhere('event.type = :type', { type: filters.type });
    }

    // 💰 Filter by price range
    if (filters.minPrice !== undefined) {
      query.andWhere('event.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('event.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    // 🏙️ Filter by country and city
    if (filters.countryId) {
      query.andWhere('event.country.id = :countryId', {
        countryId: filters.countryId,
      });
    }
    if (filters.cityId) {
      query.andWhere('event.city.id = :cityId', { cityId: filters.cityId });
    }

    // 🐾 Filter by animals and breeds
    if (
      !filters.allAnimals &&
      filters.animalIds &&
      filters.animalIds.length > 0
    ) {
      query.andWhere('pets.id IN (:...animalIds)', {
        animalIds: filters.animalIds,
      });
    }

    if (!filters.allBreeds && filters.breedIds && filters.breedIds.length > 0) {
      query.andWhere('breeds.id IN (:...breedIds)', {
        breedIds: filters.breedIds,
      });
    }

    const events = await query.getMany();
    return events.length > 0 ? events : { message: 'No matching events found' };
  }
}
