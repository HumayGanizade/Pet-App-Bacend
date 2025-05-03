import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'humay123', // Replace with process.env.JWT_SECRET
    } as any);
  }

  validate(payload: any) {
    if (!payload.id || !payload.gmail) {
      throw new Error('Invalid token payload');
    }
    return { id: payload.id, gmail: payload.gmail };
  }
}
