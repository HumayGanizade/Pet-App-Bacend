import { IsDateString, IsEmail, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateLostAnimalEventDto {
  @IsString({ message: 'name should be string' })
  name: string;

  @IsInt({ message: 'age should be integer' })
  age: number;

  @IsString({ message: 'gender should be string' })
  gender: string;

  @IsString({ message: 'photo should be string' })
  photo: string;

  @IsString({ message: 'info should be string' })
  info: string;

  @IsInt({ message: 'reward should be integer' })
  reward: number;

  @IsString({ message: 'location should be string' })
  location: string;

  @IsDateString({}, { message: 'date should be in YYYY-MM-DD format' })
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString({ message: 'contact_number should be string' })
  contact_number: string;

  @IsEmail(
    {},
    { message: 'Invalid email format. Please provide a valid email address.' },
  )
  gmail: string;

  @IsString({ message: 'petId should be string' })
  petId: string;

  @IsString({ message: 'breedId should be string' })
  breedId: string;
}
