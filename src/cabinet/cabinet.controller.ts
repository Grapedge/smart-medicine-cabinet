import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { ValidMongoIdPipe } from 'src/core/pipes/valid-mongo-id.pipe';
import { MedicineService } from 'src/medicine/medicine.service';
import { SensorService } from 'src/sensor/sensor.service';
import { UserService } from 'src/user/user.service';
import { CabinetService } from './cabinet.service';
import { BindSensorDto } from './dto/bind-sensor.dto';
import { BindUserDto } from './dto/bind-user.dto';
import { CreateCabineetRsp } from './dto/create-cabinet.dto';
import { PutMedicineDto } from './dto/put-medicine.dto';
import { AlarmLimit } from './schemas/cabinet.schema';

@ApiTags('药品柜')
@Controller('cabinet')
export class CabinetController {
  constructor(
    private cabinetService: CabinetService,
    private userService: UserService,
    private sensorService: SensorService,
    private medicineService: MedicineService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async createCabinet(): Promise<CreateCabineetRsp> {
    return this.cabinetService.createOne();
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async removeCabinet(@Param('id', ValidMongoIdPipe) id: string) {
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.removeOne(id);
  }

  @Post(':id/user')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async authForCabinet(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() bindUserDto: BindUserDto,
  ) {
    const user = await this.userService.findByPhone(bindUserDto.phone);
    if (!user) {
      throw new NotFoundException();
    }
    await this.cabinetService.authForUser(id, user);
    return {};
  }

  @Delete(':id/user/:phone')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async unauthForCabinet(
    @Param('id', ValidMongoIdPipe) id: string,
    @Param('phone') phone: string,
  ) {
    const user = await this.userService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException();
    }
    await this.cabinetService.unauthForUser(id, user);
    return {};
  }

  @Post(':id/sensor')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async bindSensor(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() bindSensorDto: BindSensorDto,
  ) {
    const sensor = await this.sensorService.findOne(bindSensorDto.mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    await this.cabinetService.bindSensor(id, sensor);
    return {};
  }

  @Delete(':id/sensor/:mac')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async unbindSensor(
    @Param('id', ValidMongoIdPipe) id: string,
    @Param('mac') mac: string,
  ) {
    const sensor = await this.sensorService.findOne(mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    await this.cabinetService.unbindSensor(id, sensor);
    return {};
  }

  @Get(':id/sensor')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse({
    description: '输入的日期不合法可能会导致服务器错误',
  })
  async viewSensorData(
    @Param('id', ValidMongoIdPipe) id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    let fromDate: Date;
    let toDate: Date;
    if (!from) {
      fromDate = new Date();
      fromDate.setHours(0, 0, 0, 0);
    } else {
      fromDate = new Date(from);
    }
    if (!to) {
      toDate = new Date();
    } else {
      toDate = new Date(to);
    }
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.findSensorData(id, fromDate, toDate);
  }

  @Post(':id/medicine')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async putMedicine(
    @Body() putDto: PutMedicineDto,
    @Param('id', ValidMongoIdPipe) id: string,
    @Query('count', ParseIntPipe) count: number,
  ) {
    const medicine = await this.medicineService.findById(putDto.medicineId);
    if (!medicine) {
      throw new NotFoundException();
    }
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.cabinetService.putMedicine(id, medicine, count);
    return {};
  }

  @Delete(':cabinetId/medicine/:medicineId')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  @ApiPreconditionFailedResponse()
  async takeMedicine(
    @Param('cabinetId', ValidMongoIdPipe) cabinetId: string,
    @Param('medicineId', ValidMongoIdPipe) medicineId: string,
    @Query('count', ParseIntPipe) count: number,
  ) {
    const isExists = await this.cabinetService.isExists(cabinetId);
    if (!isExists) {
      throw new NotFoundException();
    }
    const medicine = await this.medicineService.findById(medicineId);
    if (!medicine) {
      throw new NotFoundException();
    }
    await this.cabinetService.takeMedicine(cabinetId, medicine, count);
  }

  @Get(':id/medicine')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async viewMedicine(@Param('id', ValidMongoIdPipe) id: string) {
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.findMedicine(id);
  }

  @Post(':id/alarm')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async setAlarmLimit(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() alarm: AlarmLimit,
  ) {
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.cabinetService.setAlarm(id, alarm);
    return {};
  }

  @Get(':id/alarm')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async getAlarm(@Param('id', ValidMongoIdPipe) id: string) {
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.getAlarm(id);
  }
}
