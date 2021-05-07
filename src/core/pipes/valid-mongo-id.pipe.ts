import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class ValidMongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (isMongoId(value)) {
      return value;
    }
    throw new BadRequestException(`不是一个有效的 id`, 'invalid_id');
  }
}
