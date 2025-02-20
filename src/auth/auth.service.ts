import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async validateUser(dto: authPayloadDto) {
    const findUser = await this.userRepo.findOne({
      where: { gmail: dto.username },
    });
    if (!findUser) {
      throw new UnauthorizedException('Invalid email or password!');
    }
    if (findUser) {
      const matched = await comparePasswords(dto.password, findUser.password);
      if (matched) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = findUser;
        const token = this.jwtService.sign(user);
        return { token };
      } else throw new UnauthorizedException('Invalid email or password!');
    }
  }
}
