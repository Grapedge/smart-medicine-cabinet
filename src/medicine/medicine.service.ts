import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from 'src/core/dto/query.dto';
import { queryBuilder } from 'src/core/utils/query-builder';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async has(id: string) {
    return !!(await this.medicineModel.countDocuments({
      _id: id,
    }));
  }

  async total() {
    return this.medicineModel.countDocuments();
  }

  async findById(id: string) {
    return this.medicineModel.findById(id);
  }

  async findMany(query: QueryDto) {
    return queryBuilder(this.medicineModel, query);
  }

  async createOne(createMedicineDto: CreateMedicineDto) {
    const medicine = new this.medicineModel(createMedicineDto);
    return medicine.save();
  }

  async updateOne(id: string, changes: UpdateMedicineDto) {
    return this.medicineModel.findByIdAndUpdate(id, changes, {
      new: true,
    });
  }

  async removeOne(id: string) {
    return this.medicineModel.findByIdAndDelete(id);
  }
}
