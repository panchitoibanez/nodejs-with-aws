import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must be less than 100 characters.' })
  name: string;
}
