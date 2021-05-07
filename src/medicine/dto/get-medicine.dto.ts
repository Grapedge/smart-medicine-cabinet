import { QueryRsp } from 'src/core/dto/query.dto';
import { Medicine } from '../schemas/medicine.schema';

export class GetMedicineRsp extends QueryRsp {
  data: Medicine[];
}
