import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AllSeatDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
  orderby?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seat_zone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seat_row?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seat_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  seat_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  event_id?: number;
}
