import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RemoveOneRsp } from 'src/core/dto/remove.dto';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { ValidMongoIdPipe } from 'src/core/pipes/valid-mongo-id.pipe';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { FindManyMedicineRsp } from './dto/find-many-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineService } from './medicine.service';
import { Medicine } from './schemas/medicine.schema';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { JwtAuth } from 'src/core/decorators/jwt-auth.decorator';

@ApiTags('药品')
@Controller('medicine')
export class MedicineController {
  constructor(private medicineService: MedicineService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({
    description: '创建一个药品',
  })
  @ApiConflictResponse()
  async createMedicine(
    @Body() createMedicineDto: CreateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.medicineService.createOne(createMedicineDto);
    return medicine;
  }

  @Get(':id')
  @JwtAuth()
  @ApiNotFoundResponse()
  async findMedicine(
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<Medicine> {
    const medicine = await this.medicineService.findById(id);
    if (!medicine) {
      throw new NotFoundException();
    }
    return medicine;
  }

  @Get()
  @JwtAuth()
  async findManyMedicine(
    @Query() query: FindManyDto,
  ): Promise<FindManyMedicineRsp> {
    const [total, data] = await Promise.all([
      this.medicineService.total(),
      this.medicineService.findMany(query),
    ]);
    return {
      total,
      current: query.current,
      pageSize: query.pageSize,
      data,
    };
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async updateMedicine(
    @Param('id', ValidMongoIdPipe) id: string,
    @Body() update: UpdateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.medicineService.updateOne(id, update);
    if (!medicine) {
      throw new NotFoundException();
    }
    return medicine;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiNotFoundResponse()
  async removeOne(
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<RemoveOneRsp> {
    const medicine = await this.medicineService.removeOne(id);
    if (!medicine) {
      throw new NotFoundException();
    }
    return {
      deleted: id,
    };
  }
}
