import { IsNumber, IsString, Matches } from 'class-validator';

export class ServerConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @Matches(/^\//)
  openApiPath: string;
}
