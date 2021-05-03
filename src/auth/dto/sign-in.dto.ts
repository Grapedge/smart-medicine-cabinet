import { IsPhoneNumber, IsString } from 'class-validator';

export class SignInDto {
  @IsPhoneNumber('CN')
  phone: string;

  @IsString()
  password: string;
}

export class SignInRsp {
  accessToken: string;
  refreshToken: string;
}
