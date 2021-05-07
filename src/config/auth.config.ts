import { IsDefined, IsString } from 'class-validator';

export class AuthConfig {
  @IsString()
  issuer: string;

  @IsString()
  secret: string;

  @IsDefined()
  accessTokenExpiresIn: string | number;

  @IsDefined()
  refreshTokenExpiresIn: string | number;
}
