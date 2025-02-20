import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './typeorm/entities/user.entity';
import { EventEntity } from './typeorm/entities/event.entity';
import { RescueAnimalEventEntity } from './typeorm/entities/rescue-animal-event.entity';
import { LostAnimalEventEntity } from './typeorm/entities/lost-animal-event.entity';
import { CommentEntity } from './typeorm/entities/comment.entity';
import { PetEntity } from './typeorm/entities/pet.entity';
import { BreedEntity } from './typeorm/entities/breed.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { RescueEventModule } from './rescue-event/rescue-event.module';
import { LostAnimalEventModule } from './lost-animal-event/lost-animal-event.module';
import { CommentModule } from './comment/comment.module';
import { DropdownInfoModule } from './dropdown-info/dropdown-info.module';
import { CountryEntity } from './typeorm/entities/country.entity';
import { CityEntity } from './typeorm/entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
      ],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
    EventModule,
    RescueEventModule,
    LostAnimalEventModule,
    CommentModule,
    DropdownInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
