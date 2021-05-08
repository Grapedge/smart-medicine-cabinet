import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { findManyHelper } from 'src/core/utils/find-many-helper';
import { AppendSensorDataDto } from './dto/append-sensor-data.dto';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Sensor, SensorDocument } from './schemas/sensor.schema';

@Injectable()
export class SensorService {
  constructor(
    @InjectModel(Sensor.name) private sensorModel: Model<SensorDocument>,
  ) {}

  async total(): Promise<number> {
    return this.sensorModel.countDocuments();
  }

  async isExists(mac: string) {
    return this.sensorModel.exists(
      this.sensorModel.translateAliases({
        mac,
      }),
    );
  }

  async findOne(mac: string): Promise<SensorDocument> {
    return this.sensorModel.findById(mac);
  }

  async createOne(createSensorDto: CreateSensorDto): Promise<SensorDocument> {
    const sensor = new this.sensorModel(createSensorDto);
    return sensor.save();
  }

  async removeOne(mac: string): Promise<SensorDocument> {
    return this.sensorModel.findOneAndDelete(
      this.sensorModel.translateAliases({
        mac,
      }),
    );
  }

  async appendData(
    mac: string,
    appendDataDto: AppendSensorDataDto,
  ): Promise<void> {
    const sensor = await this.sensorModel.findById(mac);
    sensor.data.push(appendDataDto);
    await sensor.save();
  }

  async findMany(findManyDto: FindManyDto): Promise<SensorDocument[]> {
    const builder = this.sensorModel.find();
    return findManyHelper(builder, findManyDto);
  }
}
