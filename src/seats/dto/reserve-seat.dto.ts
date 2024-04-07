import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateSeatDto } from './create-seat.dto';
import { SeatStatus } from '../entities/seat.entity';

export class ReserveSeatDto extends PartialType(CreateSeatDto) {
  @ApiProperty({ example: 35 })
  id: number;

  @ApiProperty({ example: 'VIP' })
  seat_zone: string;

  @ApiProperty({ example: 'B' })
  seat_row: string;

  @ApiProperty({ example: '015' })
  seat_number: string;

  @ApiProperty({
    enum: SeatStatus,
    enumName: 'SeatStatus',
    example: 'RESERVED',
  })
  seat_status: SeatStatus;

  @ApiProperty({ example: 1 })
  event_id: number;

  @ApiProperty({ example: 1 })
  reserved_user_id: number;
}
