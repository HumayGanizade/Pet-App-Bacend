import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text must be string' })
  text: string;

  @Min(1)
  @Max(3)
  @IsInt({ message: 'start must be integer' })
  eventTypeId: number;
}
