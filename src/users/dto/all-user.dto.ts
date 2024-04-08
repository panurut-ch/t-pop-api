import { ApiProperty } from '@nestjs/swagger';

export class AllUserDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
  orderby?: string;

  @ApiProperty({ example: '' })
  name?: string;

  @ApiProperty({ example: '' })
  email?: string;
}
