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

  @ApiProperty({ example: 'Songkarn Day Bangkok 2024' })
  event_name?: string;

  @ApiProperty({ example: 'Water festival in thailand summer 2024' })
  event_description?: string;

  @ApiProperty({ example: '2024-04-13T03:00:00.000Z' })
  event_date?: Date;

  @ApiProperty({ example: 500 })
  total_seat?: number;
}
