import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { PetEntity } from './pet.entity';
import { CommentEntity } from './comment.entity';
import { BreedEntity } from './breed.entity';
import { CountryEntity } from './country.entity';
import { CityEntity } from './city.entity';

@Entity({ name: 'event' })
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'int' })
  price: number;

  @ManyToOne(() => CountryEntity, (country) => country.events)
  country: CountryEntity;

  @ManyToOne(() => CityEntity, (city) => city.events)
  city: CityEntity;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar', length: 500 })
  photo: string;

  @Column({ type: 'varchar' })
  info: string;

  @Column({ type: 'varchar' })
  plan: string;

  @Column({ type: 'varchar' })
  contact_number: string;

  @Column({ type: 'varchar' })
  gmail: string;

  @Column({ type: 'boolean' })
  allAnimals: boolean;

  @Column({ type: 'boolean' })
  allBreeds: boolean;

  @ManyToOne(() => UserEntity, (user) => user.events)
  user: UserEntity;

  @ManyToMany(() => PetEntity, (pet) => pet.events)
  @JoinTable()
  pets: PetEntity[];

  @ManyToMany(() => BreedEntity, (breed) => breed.events)
  @JoinTable()
  breeds: BreedEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.event)
  comments: CommentEntity[];
}
