import { IsNumber, IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  database: string;
}
