import { DataSource } from 'typeorm';
import { UserEntity } from './typeorm/entities/user.entity';
import { EventEntity } from './typeorm/entities/event.entity';
import { RescueAnimalEventEntity } from './typeorm/entities/rescue-animal-event.entity';
import { LostAnimalEventEntity } from './typeorm/entities/lost-animal-event.entity';
import { CommentEntity } from './typeorm/entities/comment.entity';
import { BreedEntity } from './typeorm/entities/breed.entity';
import { CityEntity } from './typeorm/entities/city.entity';
import { PetColorEntity } from './typeorm/entities/pet-color.entity';
import { CountryEntity } from './typeorm/entities/country.entity';
import { PetEntity } from './typeorm/entities/pet.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rootRoot',
  database: 'petDB',
  entities: [
    UserEntity,
    EventEntity,
    RescueAnimalEventEntity,
    LostAnimalEventEntity,
    CommentEntity,
    PetEntity,
    BreedEntity,
    CountryEntity,
    CityEntity,
    PetColorEntity,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
