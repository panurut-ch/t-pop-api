import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { AllSeatDto } from './dto/all-seat.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatsService.create(createSeatDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    return await this.seatsService.findAll();
  }

  @Post('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPaging(@Body() allSeatDto: AllSeatDto) {
    return await this.seatsService.findAllPaging(allSeatDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.seatsService.findOne(+id);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatsService.update(+id, updateSeatDto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.seatsService.remove(+id);
  }
}
