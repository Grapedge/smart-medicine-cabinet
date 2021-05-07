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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RemoveRsp } from 'src/core/dto/remove.dto';
import { FindManyDto } from 'src/core/dto/find-many.dto';
import { ValidMongoIdPipe } from 'src/core/pipes/valid-mongo-id.pipe';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { GetMedicineRsp } from './dto/get-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineService } from './medicine.service';
import { Medicine } from './schemas/medicine.schema';

@ApiTags('药品')
@Controller('medicine')
export class MedicineController {
  constructor(private medicineService: MedicineService) {}

  @Post()
  @ApiOperation({
    description: '创建一个药品',
  })
  async createMedicine(
    @Body() createMedicineDto: CreateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.medicineService.createOne(createMedicineDto);
    return medicine;
  }

  @Get(':id')
  async findOne(@Param('id', ValidMongoIdPipe) id: string): Promise<Medicine> {
    const medicine = await this.medicineService.findById(id);
    if (!medicine) {
      throw new NotFoundException();
    }
    return medicine;
  }

  @Get()
  async findMany(@Query() query: FindManyDto): Promise<GetMedicineRsp> {
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
  async updateOne(
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
  async removeOne(
    @Param('id', ValidMongoIdPipe) id: string,
  ): Promise<RemoveRsp> {
    const medicine = await this.medicineService.removeOne(id);
    if (!medicine) {
      throw new NotFoundException();
    }
    return {
      deleted: id,
    };
  }
}
