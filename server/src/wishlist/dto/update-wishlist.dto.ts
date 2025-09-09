import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
