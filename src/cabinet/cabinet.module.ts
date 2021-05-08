import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { Cabinet, CabinetSchema } from './schemas/cabinet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cabinet.name,
        schema: CabinetSchema,
      },
    ]),
  ],
  controllers: [CabinetController],
  providers: [CabinetService],
})
export class CabinetModule {}
