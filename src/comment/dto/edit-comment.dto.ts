import { IsInt, IsString } from 'class-validator';

export class EditCommentDto {
  @IsInt({ message: 'start must be integer' })
  stars: number;

  @IsString({ message: 'text must be string' })
  text: string;
}
