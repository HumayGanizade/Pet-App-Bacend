import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const findUser = await this.userRepo.findOne({
      where: { gmail: dto.gmail },
    });
    if (findUser) {
      throw new HttpException(
        'user with given email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    dto.password = await encodePassword(dto.password);
    const newUserObject = {
      name: dto.name,
      surname: dto.surname,
      date_of_birth: dto.date_of_birth,
      gender: dto.gender,
      photo: null,
      gmail: dto.gmail,
      password: dto.password,
      contact_number: null,
    };
    const newUser = await this.userRepo.create(newUserObject);
    await this.userRepo.save(newUser);
    return { message: 'User was successfully created' };
  }
}
