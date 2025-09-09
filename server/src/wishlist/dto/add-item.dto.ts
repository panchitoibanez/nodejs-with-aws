import { IsNotEmpty, IsUrl } from 'class-validator';

export class AddItemDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
