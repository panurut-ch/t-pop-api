import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AllEventDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perpage: number;

  @ApiProperty({ example: 'id' })
  @IsOptional()
  sortbycolumn?: string;

  @ApiProperty({ example: 'asc' })
  @IsOptional()
  orderby?: string;

  @ApiPropertyOptional()
  @IsOptional()
  event_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  event_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  event_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  total_seat?: number;
}
