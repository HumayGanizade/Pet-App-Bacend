import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';
import { LostAnimalEventEntity } from './lost-animal-event.entity';
import { RescueAnimalEventEntity } from './rescue-animal-event.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  stars: number;

  @Column({ type: 'varchar' })
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => EventEntity, (event) => event.comments)
  event: EventEntity;

  @ManyToOne(() => LostAnimalEventEntity, (event) => event.comments)
  lost_animal_event: LostAnimalEventEntity;

  @ManyToOne(() => RescueAnimalEventEntity, (event) => event.comments)
  rescue_animal_event: RescueAnimalEventEntity;
}
