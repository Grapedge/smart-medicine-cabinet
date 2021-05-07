import { Document, Model } from 'mongoose';
import { FindManyDto } from '../dto/find-many.dto';

export function queryBuilder<T extends Document>(
  model: Model<T>,
  query: FindManyDto,
) {
  let builder = model.find();
  if (query.sort && query.sort.length > 0) {
    const sort = query.sort
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
  const offset = (query.current - 1) * query.pageSize;
  return builder.skip(offset).limit(query.pageSize);
}
