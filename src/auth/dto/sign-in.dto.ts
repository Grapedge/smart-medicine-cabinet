import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class SignInDto {
  @IsPhoneNumber('CN')
  @ApiProperty({
    description: '用户手机号',
    example: '13311112222',
  })
  phone: string;

  @IsString()
  password: string;
}

export class SignInRsp {
  accessToken: string;
  refreshToken: string;
}
