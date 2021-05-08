import { IsString } from 'class-validator';

export class CreateCabineetRsp {
  @IsString()
  id: string;
}
