import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString({ message: 'photo should be type  string' })
  @IsOptional()
  photo?: string;

  @IsString()
  @IsNotEmpty()
  contact_number: string;
}
