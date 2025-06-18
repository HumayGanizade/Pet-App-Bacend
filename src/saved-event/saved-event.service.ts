import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { EventEntity } from '../typeorm/entities/event.entity';
import { RescueAnimalEventEntity } from '../typeorm/entities/rescue-animal-event.entity';
import { LostAnimalEventEntity } from '../typeorm/entities/lost-animal-event.entity';

@Injectable()
export class SavedEventService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private eventRepo: Repository<EventEntity>,
    @InjectRepository(RescueAnimalEventEntity)
    private rescueEventRepo: Repository<RescueAnimalEventEntity>,
    @InjectRepository(LostAnimalEventEntity)
    private lostAnimalEventRepo: Repository<LostAnimalEventEntity>,
  ) {}

  async addEventToUser(eventId: string, userId: string, eventTypeId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'savedGeneralEvents',
        'savedRescueEvents',
        'savedLostAnimalEvents',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    if (eventTypeId === '1') {
      const event = await this.eventRepo.findOne({ where: { id: eventId } });
      if (!event) throw new NotFoundException('Event not found');
      user.savedGeneralEvents ??= [];

      if (!user.savedGeneralEvents.some((e) => e.id === eventId)) {
        user.savedGeneralEvents.push(event);
        await this.userRepo.save(user);
      }
    } else if (eventTypeId === '2') {
      const event = await this.rescueEventRepo.findOne({
        where: { id: eventId },
      });
      if (!event) throw new NotFoundException('Event not found');
      user.savedRescueEvents ??= [];

      if (!user.savedRescueEvents.some((e) => e.id === eventId)) {
        user.savedRescueEvents.push(event);
        await this.userRepo.save(user);
      }
    } else if (eventTypeId === '3') {
      const event = await this.lostAnimalEventRepo.findOne({
        where: { id: eventId },
      });
      if (!event) throw new NotFoundException('Event not found');
      user.savedLostAnimalEvents ??= [];

      if (!user.savedLostAnimalEvents.some((e) => e.id === eventId)) {
        user.savedLostAnimalEvents.push(event);
        await this.userRepo.save(user);
      }
    } else {
      throw new BadRequestException('Invalid event type');
    }

    return { status: 'saved' };
  }

  async removeEventFromUser(
    eventId: string,
    userId: string,
    eventTypeId: string,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'savedGeneralEvents',
        'savedRescueEvents',
        'savedLostAnimalEvents',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    if (eventTypeId === '1') {
      user.savedGeneralEvents ??= [];
      user.savedGeneralEvents = user.savedGeneralEvents.filter(
        (e) => e.id !== eventId,
      );
      await this.userRepo.save(user);
    } else if (eventTypeId === '2') {
      user.savedRescueEvents ??= [];
      user.savedRescueEvents = user.savedRescueEvents.filter(
        (e) => e.id !== eventId,
      );
      await this.userRepo.save(user);
    } else if (eventTypeId === '3') {
      user.savedLostAnimalEvents ??= [];
      user.savedLostAnimalEvents = user.savedLostAnimalEvents.filter(
        (e) => e.id !== eventId,
      );
      await this.userRepo.save(user);
    } else {
      throw new BadRequestException('Invalid event type');
    }

    return { status: 'unsaved' };
  }

  async deleteEventFromUser(
    eventId: string,
    userId: string,
    eventTypeId: number,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'savedGeneralEvents',
        'savedRescueEvents',
        'savedLostAnimalEvents',
      ],
    });

    if (eventTypeId === 1) {
      user.savedGeneralEvents = user.savedGeneralEvents.filter(
        (e) => e.id !== eventId,
      );
    } else if (eventTypeId === 2) {
      user.savedRescueEvents = user.savedRescueEvents.filter(
        (e) => e.id !== eventId,
      );
    } else {
      user.savedLostAnimalEvents = user.savedLostAnimalEvents.filter(
        (e) => e.id !== eventId,
      );
    }

    await this.userRepo.save(user);
    return { message: 'event was successfully deleted.' };
  }

  async getAllSavedEventsOfUserByEventTypeId(
    userId: string,
    eventTypeId: string,
  ) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'savedGeneralEvents',
        'savedRescueEvents',
        'savedLostAnimalEvents',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    switch (eventTypeId) {
      case '1':
        return user.savedGeneralEvents ?? [];
      case '2':
        return user.savedRescueEvents ?? [];
      case '3':
        return user.savedLostAnimalEvents ?? [];
      default:
        throw new BadRequestException('Invalid event type');
    }
  }
}
