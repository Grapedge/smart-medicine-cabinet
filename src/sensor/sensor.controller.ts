import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { SensorAuth } from 'src/core/decorators/sensor-auth.decorator';
import { CurUser } from 'src/core/decorators/user.decorator';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { RemoveOneRsp } from 'src/core/dto/remove.dto';
import { Role } from 'src/core/enums/role.enum';
import { User } from 'src/user/schemas/user.schema';
import { AppendSensorDataDto } from './dto/append-sensor-data.dto';
import { CreateSensorDto, CreateSensorRsp } from './dto/create-sensor.dto';
import { FindManySensorRsp } from './dto/find-many-sensor.dto';
import { Sensor } from './schemas/sensor.schema';
import { SensorService } from './sensor.service';

@ApiTags('传感器')
@Controller('sensor')
export class SensorController {
  constructor(private sensorService: SensorService) {}

  @Post(':mac')
  @SensorAuth()
  @ApiOperation({
    description: '提交温湿度信息',
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async appendSensorData(
    @CurUser() sensor: Sensor,
    @Param('mac') mac: string,
    @Body() appendDataDto: AppendSensorDataDto,
  ): Promise<Record<string, never>> {
    if (sensor.mac !== mac) {
      throw new ForbiddenException();
    }
    const isExists = await this.sensorService.isExists(mac);
    if (!isExists) {
      throw new NotFoundException();
    }
    await this.sensorService.appendData(mac, appendDataDto);
    return {};
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({
    description: '创建一个传感器',
  })
  @ApiConflictResponse()
  async createSensor(
    @Body() createSensorDto: CreateSensorDto,
  ): Promise<CreateSensorRsp> {
    const isExists = await this.sensorService.isExists(createSensorDto.mac);
    if (isExists) {
      throw new ConflictException();
    }
    const sensor = await this.sensorService.createOne(createSensorDto);
    return {
      mac: sensor.mac,
      secret: sensor.secret,
      name: sensor.name,
    };
  }

  @Delete(':mac')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async removeSensor(@Param('mac') mac: string): Promise<RemoveOneRsp> {
    const sensor = await this.sensorService.removeOne(mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    return {
      deleted: mac,
    };
  }

  @Get(':mac')
  @Roles(Role.Admin, Role.User)
  @ApiNotFoundResponse()
  async findSensor(
    @CurUser() user: User,
    @Param('mac') mac: string,
  ): Promise<Sensor> {
    const sensor = await this.sensorService.findOne(mac);
    if (!sensor) {
      throw new NotFoundException();
    }
    return sensor;
  }

  @Get()
  @Roles(Role.Admin)
  async findManySensor(
    @Query() findManyDto: FindManyDto,
  ): Promise<FindManySensorRsp> {
    const [total, data] = await Promise.all([
      this.sensorService.total(),
      this.sensorService.findMany(findManyDto),
    ]);
    return {
      total,
      data,
      current: findManyDto.current,
      pageSize: findManyDto.pageSize,
    };
  }
}
