import { IsNumber, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class ServerConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @Matches(/^\//)
  openApiPath: string;

  @IsPhoneNumber('CN')
  adminPhone: string;

  @IsString()
  adminPassword: string;
}
