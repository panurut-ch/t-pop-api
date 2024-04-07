import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SeatStatus } from '../entities/seat.entity';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'General' })
  seat_zone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Z' })
  seat_row: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '010' })
  seat_number: string;

  @ApiProperty({
    enum: SeatStatus,
    enumName: 'SeatStatus',
    example: 'AVAILABLE',
  })
  seat_status: SeatStatus;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  event_id: number;
}
