import {
  Column,
  Entity, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PetEntity } from './pet.entity';
import { CommentEntity } from './comment.entity';
import { BreedEntity } from './breed.entity';
import { CountryEntity } from './country.entity';
import { CityEntity } from './city.entity';
import { PetColorEntity } from './pet-color.entity';

@Entity({ name: 'rescue_animal_event' })
export class RescueAnimalEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar' })
  gender: string;

  @ManyToOne(() => PetColorEntity, (petColor) => petColor.rescueEvent)
  color: PetColorEntity;

  @Column({ type: 'longtext' })
  photo: string;

  @Column({ type: 'varchar' })
  info: string;

  @ManyToOne(() => CountryEntity, (country) => country.RAEvents)
  country: CountryEntity;

  @ManyToOne(() => CityEntity, (city) => city.RAEvents)
  city: CityEntity;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  contact_number: string;

  @Column({ type: 'varchar' })
  gmail: string;

  @ManyToOne(() => UserEntity, (user) => user.rescue_animal_events)
  user: UserEntity;

  @ManyToOne(() => PetEntity, (pet) => pet.rescue_animal_events)
  pet: PetEntity;

  @ManyToOne(() => BreedEntity, (breed) => breed.rescue_animal_events)
  breed: BreedEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.rescue_animal_event)
  comments: CommentEntity[];

  @ManyToMany(() => UserEntity, (user) => user.savedRescueEvents)
  savedByUsers: UserEntity[];
}
