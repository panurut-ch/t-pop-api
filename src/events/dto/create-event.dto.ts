import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Songkarn Day Bangkok 2024' })
  event_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Water festival in thailand summer 2024' })
  event_description: string;

  @IsNotEmpty()
  @ApiProperty({ example: '2024-04-13T03:00:00.000Z' })
  event_date: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 200 })
  total_seat: number;
}
