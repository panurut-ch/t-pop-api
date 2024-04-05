import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';

export class EventEntity implements Event {
  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  event_name: string;

  @ApiProperty()
  event_description: string;

  @ApiProperty()
  total_seat: number;

  @ApiProperty()
  event_date: Date;

  @ApiProperty()
  created_date: Date;

  @ApiProperty()
  updated_date: Date;
}
