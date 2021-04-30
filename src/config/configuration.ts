import { load as loadYaml } from 'yamljs';
import { resolve } from 'path';
import { DatabaseConfig } from './database.config';
import { ServerConfig } from './server.config';
import { IsDefined, IsIn, ValidateNested, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const YAML_CONFIG_PATH = resolve(__dirname, '../../config.yaml');

export const NODE_ENVS = ['development', 'test', 'production'] as const;

export class Configuration {
  @ValidateNested()
  @IsDefined()
  server: ServerConfig;
  @ValidateNested()
  @IsDefined()
  database: DatabaseConfig;
  @IsIn(NODE_ENVS)
  nodeEnv: typeof NODE_ENVS[number];
}

export const configuration = (): Configuration => {
  const config = loadYaml(YAML_CONFIG_PATH);
  config.nodeEnv = process.env.NODE_ENV;
  const validatedConfig = plainToClass(Configuration, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    console.error(errors);
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
