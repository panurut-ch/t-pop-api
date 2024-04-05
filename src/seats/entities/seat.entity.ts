import { ApiProperty } from '@nestjs/swagger';
import { Seat } from '@prisma/client';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

export class SeatEntity implements Seat {
  constructor(partial: Partial<SeatEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  seat_zone: string;

  @ApiProperty()
  seat_row: string;

  @ApiProperty()
  seat_number: string;

  @ApiProperty()
  seat_status: SeatStatus;

  @ApiProperty()
  created_date: Date;

  @ApiProperty()
  updated_date: Date;

  @ApiProperty()
  event_id: number | null;
}
