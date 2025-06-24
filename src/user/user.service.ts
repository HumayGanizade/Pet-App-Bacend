import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword } from '../utils/bcrypt';
import { EditUserDto } from './dto/edit-user.dto';
import { compare } from 'bcrypt';
import { ChangePasswordDto } from '../event/dto/change-password.dto';

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
    const newUser = this.userRepo.create(newUserObject);
    await this.userRepo.save(newUser);
    return { message: 'User was successfully created' };
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async editUser(dto: EditUserDto, id: string): Promise<UserEntity> {
    const user = await this.getUserById(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.name = dto.name ?? user.name;
    user.surname = dto.surname ?? user.surname;
    user.contact_number = dto.contact_number ?? user.contact_number;
    user.photo = dto.photo ?? user.photo;

    return this.userRepo.save(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isMatch = await compare(dto.currentPassword, user.password);
    if (!isMatch)
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );

    user.password = await encodePassword(dto.newPassword);
    await this.userRepo.save(user);

    return { message: 'Password updated' };
  }
}
