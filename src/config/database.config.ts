import { IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  url: string;

  // @IsNumber()
  // port: number;

  // @IsString()
  // user: string;

  // @IsString()
  // password: string;

  // @IsString()
  // database: string;
}
