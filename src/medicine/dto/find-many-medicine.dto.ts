import { FindManyRsp } from 'src/core/dto/find-many.dto';
import { Medicine } from '../schemas/medicine.schema';

export class FindManyMedicineRsp extends FindManyRsp {
  data: Medicine[];
}
