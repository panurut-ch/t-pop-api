import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSeatDto } from './create-seat.dto';
import { SeatStatus } from '../entities/seat.entity';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {}
