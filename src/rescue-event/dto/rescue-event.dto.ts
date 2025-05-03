import { IsInt, IsString } from 'class-validator';

export class RescueEventDto {
  @IsString({ message: 'name must be string type' })
  name: string;

  @IsInt({ message: 'age must be string type' })
  age: number;

  @IsString({ message: 'gender must be string type' })
  gender: string;

  @IsString({ message: 'photo must be string type' })
  photo: string;

  @IsString({ message: 'info must be string type' })
  info: string;

  @IsString({ message: 'location must be string type' })
  location: string;

  @IsString({ message: 'contact_number must be string type' })
  contact_number: string;

  @IsString({ message: 'gmail must be string type' })
  gmail: string;

  @IsString({ message: 'petId must be string type' })
  petId: string;

  @IsString({ message: 'breedId must be string type' })
  breedId: string;

  @IsString({ message: 'country must be string type' })
  countryId: string;

  @IsString({ message: 'city must be string type' })
  cityId: string;
}
