import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsString,
  Length,
} from 'class-validator';

export class EditEventDto {
  @IsString({ message: 'name must be string type' })
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString({ message: 'type must be integer type' })
  type: string;

  @IsInt({ message: 'price must be integer type' })
  price: number;

  @IsString({ message: 'location must be string type' })
  location: string;

  @IsString({ message: 'photo must be string type' })
  @Length(0, 500)
  photo: string;

  @IsString({ message: 'info must be string type' })
  info: string;

  @IsString({ message: 'plan must be string type' })
  plan: string;

  @IsString({ message: 'contact_number must be string type' })
  contact_number: string;

  @IsEmail()
  gmail: string;

  @IsArray()
  petsIds?: string[];

  @IsArray()
  breedIds?: string[];

  @IsString({ message: 'country must be string type' })
  countryId: string;

  @IsString({ message: 'city must be string type' })
  cityId: string;
}
