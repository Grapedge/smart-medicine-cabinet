import { IsNumber, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class ServerConfig {
  @IsNumber()
  port: number;

  @Matches(/^\//)
  openApiPath: string;

  @IsPhoneNumber('CN')
  adminPhone: string;

  @IsString()
  adminPassword: string;
}
