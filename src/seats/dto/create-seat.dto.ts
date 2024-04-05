import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SeatStatus } from '../entities/seat.entity';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seat_zone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seat_row: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  seat_number: string;

  @ApiProperty({ enum: SeatStatus, enumName: 'SeatStatus' })
  seat_status: SeatStatus;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  event_id: number;
}
