import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cabinet, CabinetDocumet } from './schemas/cabinet.schema';

@Injectable()
export class CabinetService {
  constructor(
    @InjectModel(Cabinet.name) private cabinetModel: Model<CabinetDocumet>,
  ) {}
}
