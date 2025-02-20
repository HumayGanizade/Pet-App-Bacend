import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity } from './country.entity';
import { EventEntity } from './event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'city' })
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => CountryEntity, (country) => country.cities)
  country: CountryEntity;

  @OneToMany(() => EventEntity, (event) => event.city)
  events: EventEntity[];

  @OneToMany(() => LostAnimalEventEntity, (LAEvent) => LAEvent.city)
  LAEvents: EventEntity[];

  @OneToMany(() => RescueAnimalEventEntity, (RAEvent) => RAEvent.city)
  RAEvents: RescueAnimalEventEntity[];
}
