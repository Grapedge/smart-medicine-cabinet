import { FindManyRsp } from 'src/core/dto/find-many.dto';
import { Cabinet } from '../schemas/cabinet.schema';

export class FindManyCabinetRsp extends FindManyRsp {
  data: Cabinet[];
}
