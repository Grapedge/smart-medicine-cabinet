import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from 'src/medicine/schemas/medicine.schema';
import { Sensor } from 'src/sensor/schemas/sensor.schema';
import { SensorService } from 'src/sensor/sensor.service';
import { User } from 'src/user/schemas/user.schema';
import { AlarmLimit, Cabinet, CabinetDocumet } from './schemas/cabinet.schema';

@Injectable()
export class CabinetService {
  constructor(
    @InjectModel(Cabinet.name) private cabinetModel: Model<CabinetDocumet>,
    private sensorService: SensorService,
  ) {}

  async isExists(id: string) {
    return this.cabinetModel.exists({ _id: id });
  }

  async createOne() {
    const cabinet = new this.cabinetModel();
    return cabinet.save();
  }

  async removeOne(id: string) {
    return this.cabinetModel.findByIdAndDelete(id);
  }

  async authForUser(cabinetId: string, user: User) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    if (!cabinet.user.includes(user.phone)) {
      cabinet.user.push(user.phone);
    }
    return cabinet.save();
  }

  async unauthForUser(cabinetId: string, user: User) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    cabinet.user = cabinet.user.filter((phone) => phone === user.phone);
    return cabinet.save();
  }

  async canManage(cabinetId: string, user: User) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    return cabinet.user.includes(user.phone);
  }

  async bindSensor(cabinetId: string, sensor: Sensor) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    if (!cabinet.sensor.includes(sensor.mac)) {
      cabinet.sensor.push(sensor.mac);
    }
    return cabinet.save();
  }

  async unbindSensor(cabinetId: string, sensor: Sensor) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    cabinet.sensor = cabinet.sensor.filter((mac) => mac !== sensor.mac);
    return cabinet.save();
  }

  async findSensorData(cabinetId: string, from: Date, to: Date) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    const datas = await Promise.all(
      cabinet.sensor.map((mac) =>
        this.sensorService.findSensorData(mac, from, to),
      ),
    );
    return datas;
  }

  async putMedicine(cabinetId: string, medicine: Medicine, putCnt = 1) {
    return this.cabinetModel.findById(cabinetId).then((cabinet) => {
      const data = cabinet.medicine.get(medicine.id);
      const oldCnt = data?.count || 0;
      cabinet.medicine.set(medicine.id, {
        medicineId: medicine.id,
        count: putCnt + oldCnt,
      });
      console.log(cabinet);
      return cabinet.save();
    });
  }

  async takeMedicine(cabinetId: string, medicin: Medicine, takeCnt = 1) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    const data = cabinet.medicine.get(medicin.id);
    if (!data || data.count < takeCnt) {
      throw new PreconditionFailedException('药品数量不足');
    }
    data.count -= takeCnt;
    if (data.count === 0) {
      cabinet.medicine.delete(medicin.id);
    } else {
      cabinet.medicine.set(medicin.id, data);
    }
    return cabinet.save();
  }

  async findMedicine(cabinetId: string) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    console.log(cabinet.medicine.values());
    return Array.from(cabinet.medicine.values());
  }

  async setAlarm(cabinetId: string, limit: AlarmLimit) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    cabinet.alarm = limit;
    return cabinet.save();
  }

  async getAlarm(cabinetId: string) {
    const cabinet = await this.cabinetModel.findById(cabinetId);
    const { alarm } = cabinet;
    const data = await Promise.all(
      cabinet.sensor.map((mac) => this.sensorService.findLatestSensorData(mac)),
    );
    return data.filter(
      (data) =>
        data.temperature >= alarm.temperature ||
        data.humidity >= alarm.humidity,
    );
  }
}
