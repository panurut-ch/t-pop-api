import { ApiProperty } from '@nestjs/swagger';

export class AllEventDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
  orderby?: string;

  @ApiProperty()
  event_name?: string;

  @ApiProperty()
  event_description?: string;

  @ApiProperty()
  event_date?: Date;

  @ApiProperty()
  total_seat?: number;
}
