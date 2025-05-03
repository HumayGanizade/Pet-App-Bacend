import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { EventEntity } from './event.entity';
import { BreedEntity } from './breed.entity';

@Entity({ name: 'pet' })
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(
    () => RescueAnimalEventEntity,
    (rescue_animal_event) => rescue_animal_event.pet,
  )
  rescue_animal_events: RescueAnimalEventEntity[];

  @OneToMany(
    () => LostAnimalEventEntity,
    (lost_animal_event) => lost_animal_event.pet,
  )
  lost_animal_events: LostAnimalEventEntity[];

  @ManyToMany(() => EventEntity, (event) => event.pets)
  events: EventEntity[];

  @OneToMany(() => BreedEntity, (breed) => breed.pet)
  breeds: BreedEntity[];
}
