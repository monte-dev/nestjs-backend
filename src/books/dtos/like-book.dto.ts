import { IsNotEmpty, IsUUID } from 'class-validator';

export class LikeBookDTO {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;
}
