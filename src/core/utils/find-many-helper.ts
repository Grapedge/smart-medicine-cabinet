import { Document, Query } from 'mongoose';
import { FindManyDto } from '../dto/find-many.dto';

export function findManyHelper<T extends Document>(
  builder: Query<T[], T, unknown>,
  findManyDto: FindManyDto,
) {
  if (findManyDto.sort && findManyDto.sort.length > 0) {
    const sort = findManyDto.sort
      .split(',')
      .filter(Boolean)
      .map((str) => str.split(':'))
      .reduce((acc, [k, v]) => {
        if (v === 'asc' || v === 'desc') acc[k] = v;
        return acc;
      }, {});
    if (Object.keys(sort).length > 0) {
      builder = builder.sort(sort);
    }
  }
  const offset = (findManyDto.current - 1) * findManyDto.pageSize;
  return builder.skip(offset).limit(findManyDto.pageSize);
}
