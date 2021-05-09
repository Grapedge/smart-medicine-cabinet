import { SensorData } from 'src/sensor/schemas/sensor.schema';

export class ViewSensor {
  mac: string;
  data: SensorData[];
}

export class ViewSensorDataRsp {
  total: number;
  data: ViewSensor[];
}
