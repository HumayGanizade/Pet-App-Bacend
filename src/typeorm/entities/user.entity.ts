import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CommentEntity } from './comment.entity';
import { EventEntity } from './event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'longtext', nullable: true })
  photo: string;

  @Column({ type: 'varchar' })
  gmail: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  contact_number: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => EventEntity, (event) => event.user)
  events: EventEntity[];

  @OneToMany(() => LostAnimalEventEntity, (event) => event.user)
  lost_animal_events: LostAnimalEventEntity[];

  @OneToMany(() => RescueAnimalEventEntity, (event) => event.user)
  rescue_animal_events: RescueAnimalEventEntity[];
}
