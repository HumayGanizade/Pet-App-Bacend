import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity } from './city.entity';
import { EventEntity } from './event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'country' })
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => CityEntity, (city) => city.country)
  cities: CityEntity[];

  @OneToMany(() => EventEntity, (event) => event.country)
  events: EventEntity[];

  @OneToMany(() => LostAnimalEventEntity, (LAEvent) => LAEvent.country)
  LAEvents: LostAnimalEventEntity[];

  @OneToMany(() => RescueAnimalEventEntity, (RAEvent) => RAEvent.country)
  RAEvents: RescueAnimalEventEntity[];
}
