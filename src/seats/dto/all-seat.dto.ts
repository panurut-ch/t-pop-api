import { ApiProperty } from '@nestjs/swagger';

export class AllSeatDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perpage: number;

  @ApiProperty()
  sortbycolumn?: string;

  @ApiProperty()
  orderby?: string;

  @ApiProperty()
  seat_zone?: string;

  @ApiProperty()
  seat_row?: string;

  @ApiProperty()
  seat_number?: string;

  @ApiProperty()
  seat_status?: string;

  @ApiProperty()
  event_id?: number;
}
