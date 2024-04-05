import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SeatsController],
  providers: [SeatsService],
  imports: [PrismaModule],
})
export class SeatsModule {}
