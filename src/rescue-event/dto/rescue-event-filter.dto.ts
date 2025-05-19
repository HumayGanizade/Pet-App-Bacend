import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RescueEventFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAge?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  petId?: string;

  @IsOptional()
  @IsArray()
  breedIds?: string[];

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  cityId?: string;
}
