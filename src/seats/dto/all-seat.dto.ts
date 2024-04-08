import { ApiProperty } from '@nestjs/swagger';

export class AllSeatDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
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
