import { ApiProperty } from '@nestjs/swagger';

export class ViewReservedSeatDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
  orderby?: string;

  @ApiProperty({ example: 1 })
  reserved_user_id: number;
}
