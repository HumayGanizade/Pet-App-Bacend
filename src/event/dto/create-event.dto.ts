import {
  IsString,
  IsArray,
  IsDate,
  IsInt,
  IsEmail,
  Length,
  IsBoolean,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsInt()
  type: number;

  @IsInt()
  price: number;

  @IsString()
  location: string;

  @IsString()
  @Length(0, 500)
  photo: string;

  @IsString()
  info: string;

  @IsString()
  plan: string;

  @IsString()
  contact_number: string;

  @IsEmail()
  gmail: string;

  @IsBoolean()
  allAnimals: boolean;

  @IsBoolean()
  allBreeds: boolean;

  @IsArray()
  petsIds?: string[];

  @IsArray()
  breedIds?: string[];
}
