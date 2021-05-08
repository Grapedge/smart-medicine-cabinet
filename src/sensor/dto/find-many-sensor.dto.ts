import { FindManyRsp } from 'src/core/dto/find-many.dto';
import { Sensor } from '../schemas/sensor.schema';

export class FindManySensorRsp extends FindManyRsp {
  data: Sensor[];
}
