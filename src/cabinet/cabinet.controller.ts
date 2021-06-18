import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { CurUser } from 'src/core/decorators/user.decorator';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { RemoveOneRsp } from 'src/core/dto/remove.dto';
import { Role } from 'src/core/enums/role.enum';
import { ValidMongoIdPipe } from 'src/core/pipes/valid-mongo-id.pipe';
import { MedicineService } from 'src/medicine/medicine.service';
import { SensorService } from 'src/sensor/sensor.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { CabinetService } from './cabinet.service';
import { BindSensorDto } from './dto/bind-sensor.dto';
import { BindUserDto } from './dto/bind-user.dto';
import { CreateCabineetRsp } from './dto/create-cabinet.dto';
import { FindManyCabinetRsp } from './dto/find-many-cabinet.dto';
import { PutMedicineDto } from './dto/put-medicine.dto';
import { ViewSensorDataRsp } from './dto/view-sensor.dto';
import { AlarmLimit, CabinetMedicineData } from './schemas/cabinet.schema';

@ApiTags('药品柜')
@Controller('cabinet')
export class CabinetController {
  constructor(
    private cabinetService: CabinetService,
    private userService: UserService,
    private sensorService: SensorService,
    private medicineService: MedicineService,
  ) {}

  @Get()
  @JwtAuth()
  @ApiOperation({
    summary: '查看药品柜列表',
  })
  async findManyCabinets(
    @Query() query: FindManyDto,
  ): Promise<FindManyCabinetRsp> {
    const [total, data] = await Promise.all([
      this.cabinetService.total(),
      this.cabinetService.findMany(query),
    ]);
    return {
      total,
      current: query.current,
      pageSize: query.pageSize,
      data,
    };
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】创建药品柜',
  })
  async createCabinet(): Promise<CreateCabineetRsp> {
    const cabinet = await this.cabinetService.createOne();
    return {
      id: cabinet.id,
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】删除药品柜',
  })
  @ApiNotFoundResponse()
  async removeCabinet(
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<RemoveOneRsp> {
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.cabinetService.removeOne(id);
    return {
      deleted: id,
    };
  }

  @Post(':id/user')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】授权用户管理药品柜',
  })
  @ApiNotFoundResponse()
  async authForCabinet(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() bindUserDto: BindUserDto,
  ): Promise<Record<string, never>> {
    const user = await this.userService.findByPhone(bindUserDto.phone);
    if (!user) {
      throw new NotFoundException();
    }
    await this.cabinetService.authForUser(id, user);
    return {};
  }

  @Delete(':id/user/:phone')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】取消用户授权',
  })
  @ApiNotFoundResponse()
  async unauthForCabinet(
    @Param('id', ValidMongoIdPipe) id: string,
    @Param('phone') phone: string,
  ): Promise<Record<string, never>> {
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
  @ApiOperation({
    summary: '【管理员】绑定传感器',
  })
  async bindSensor(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() bindSensorDto: BindSensorDto,
  ): Promise<Record<string, never>> {
    const sensor = await this.sensorService.findOne(bindSensorDto.mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    await this.cabinetService.bindSensor(id, sensor);
    return {};
  }

  @Delete(':id/sensor/:mac')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: '【管理员】取消绑定传感器',
  })
  @ApiNotFoundResponse()
  async unbindSensor(
    @Param('id', ValidMongoIdPipe) id: string,
    @Param('mac') mac: string,
  ): Promise<Record<string, never>> {
    const sensor = await this.sensorService.findOne(mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    await this.cabinetService.unbindSensor(id, sensor);
    return {};
  }

  @Get(':id/sensor')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '查看药品柜的温湿度数据',
  })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse({
    description: '输入的日期不合法可能会导致服务器错误',
  })
  async viewSensorData(
    @CurUser() user: User,
    @Param('id', ValidMongoIdPipe) id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ViewSensorDataRsp> {
    if (!(await this.cabinetService.canManage(id, user))) {
      throw new ForbiddenException();
    }
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
    const data = await this.cabinetService.findSensorData(id, fromDate, toDate);
    return {
      total: data.length,
      data,
    };
  }

  @Post(':id/medicine')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '存入药品',
  })
  @ApiNotFoundResponse()
  async putMedicine(
    @CurUser() user: User,
    @Body() putDto: PutMedicineDto,
    @Param('id', ValidMongoIdPipe) id: string,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Record<string, never>> {
    if (!(await this.cabinetService.canManage(id, user))) {
      throw new ForbiddenException();
    }
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
  @ApiOperation({
    summary: '取出药品',
  })
  @ApiNotFoundResponse()
  @ApiPreconditionFailedResponse()
  async takeMedicine(
    @CurUser() user: User,
    @Param('cabinetId', ValidMongoIdPipe) cabinetId: string,
    @Param('medicineId', ValidMongoIdPipe) medicineId: string,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Record<string, never>> {
    if (!(await this.cabinetService.canManage(cabinetId, user))) {
      throw new ForbiddenException();
    }
    const isExists = await this.cabinetService.isExists(cabinetId);
    if (!isExists) {
      throw new NotFoundException();
    }
    const medicine = await this.medicineService.findById(medicineId);
    if (!medicine) {
      throw new NotFoundException();
    }
    await this.cabinetService.takeMedicine(cabinetId, medicine, count);
    return {};
  }

  @Get(':id/medicine')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '查看柜内药品编号及数量',
  })
  @ApiNotFoundResponse()
  async viewMedicine(
    @CurUser() user: User,
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<CabinetMedicineData[]> {
    if (!(await this.cabinetService.canManage(id, user))) {
      throw new ForbiddenException();
    }
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.findMedicine(id);
  }

  @Post(':id/alarm')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '设置报警限度',
  })
  @ApiNotFoundResponse()
  async setAlarmLimit(
    @CurUser() user: User,
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() alarm: AlarmLimit,
  ): Promise<Record<string, never>> {
    if (!(await this.cabinetService.canManage(id, user))) {
      throw new ForbiddenException();
    }
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.cabinetService.setAlarm(id, alarm);
    return {};
  }

  @Get(':id/alarm')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: '获取报警数据',
    description: '如果有温湿度超过预设上限，将会展示温湿度数据',
  })
  @ApiNotFoundResponse()
  async getAlarm(
    @CurUser() user: User,
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<AlarmLimit[]> {
    if (!(await this.cabinetService.canManage(id, user))) {
      throw new ForbiddenException();
    }
    const isExists = await this.cabinetService.isExists(id);
    if (!isExists) {
      throw new NotFoundException();
    }
    return this.cabinetService.getAlarm(id);
  }
}
