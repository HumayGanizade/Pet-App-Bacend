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

@Entity({ name: 'lost_animal_event' })
export class LostAnimalEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar' })
  gender: string;

  @ManyToOne(() => PetColorEntity, (petColor) => petColor.lostAnimalEvent)
  color: PetColorEntity;

  @Column({ type: 'longtext' })
  photo: string;

  @Column({ type: 'varchar' })
  info: string;

  @Column({ type: 'int' })
  reward: number;

  @ManyToOne(() => CountryEntity, (country) => country.LAEvents)
  country: CountryEntity;

  @ManyToOne(() => CityEntity, (city) => city.LAEvents)
  city: CityEntity;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar' })
  contact_number: string;

  @Column({ type: 'varchar' })
  gmail: string;

  @ManyToOne(() => UserEntity, (user) => user.lost_animal_events)
  user: UserEntity;

  @ManyToOne(() => PetEntity, (pet) => pet.lost_animal_events)
  pet: PetEntity;

  @ManyToOne(() => BreedEntity, (breed) => breed.lost_animal_events)
  breed: BreedEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.lost_animal_event)
  comments: CommentEntity[];

  @ManyToMany(() => UserEntity, (user) => user.savedLostAnimalEvents)
  savedByUsers: UserEntity[];
}
