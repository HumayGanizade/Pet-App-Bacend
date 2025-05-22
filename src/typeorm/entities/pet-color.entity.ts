import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'pet-color' })
export class PetColorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => LostAnimalEventEntity, (pet) => pet.color)
  lostAnimalEvent: LostAnimalEventEntity[];

  @OneToMany(() => RescueAnimalEventEntity, (pet) => pet.color)
  rescueEvent: RescueAnimalEventEntity[];
}
