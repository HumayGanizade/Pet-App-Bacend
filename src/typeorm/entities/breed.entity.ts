import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetEntity } from './pet.entity';
import { EventEntity } from './event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'breed' })
export class BreedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => PetEntity, (pet) => pet.breeds)
  pet: PetEntity;

  @ManyToMany(() => EventEntity, (event) => event.breeds)
  events: EventEntity[];

  @OneToMany(
    () => LostAnimalEventEntity,
    (lost_animal_event) => lost_animal_event.breed,
  )
  lost_animal_events: LostAnimalEventEntity[];

  @OneToMany(
    () => RescueAnimalEventEntity,
    (rescue_animal_events) => rescue_animal_events.breed,
  )
  rescue_animal_events: RescueAnimalEventEntity[];
}
