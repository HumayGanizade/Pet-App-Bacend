import {
  IsString,
  IsArray,
  IsDate,
  IsInt,
  IsEmail,
  Length,
} from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'name should be type  string' })
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString({ message: 'type should be type  string' })
  type: string;

  @IsInt({ message: 'price should be type  string' })
  price: number;

  @IsString({ message: 'location should be type  string' })
  location: string;

  @IsString({ message: 'photo should be type  string' })
  @Length(0, 500)
  photo: string;

  @IsString({ message: 'info should be type  string' })
  info: string;

  @IsString({ message: 'plan should be type  string' })
  plan: string;

  @IsString({ message: 'contact_number should be type  string' })
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
