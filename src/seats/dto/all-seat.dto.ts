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

  @ApiProperty({ example: 'General' })
  seat_zone?: string;

  @ApiProperty({ example: 'B' })
  seat_row?: string;

  @ApiProperty({ example: '' })
  seat_number?: string;

  @ApiProperty({ example: 'AVAILABLE' })
  seat_status?: string;

  @ApiProperty({ example: 2 })
  event_id?: number;
}
