import { IsString } from 'class-validator';

export class EditCommentDto {
  @IsString({ message: 'text must be string' })
  text: string;
}
