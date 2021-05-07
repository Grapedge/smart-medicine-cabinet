import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { findManyHelper } from 'src/core/utils/find-many-helper';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async isExists(id: string) {
    return this.medicineModel.countDocuments(
      this.medicineModel.translateAliases({
        id,
      }),
    );
  }

  async total() {
    return this.medicineModel.countDocuments();
  }

  async findById(id: string) {
    return this.medicineModel.findById(id);
  }

  async findMany(findManyDto: FindManyDto) {
    return findManyHelper(this.medicineModel.find(), findManyDto);
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
