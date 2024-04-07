import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
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
@ApiTags('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createSeatDto: CreateSeatDto) {
    return await this.seatsService.create(createSeatDto);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async findAll() {
  //   return await this.seatsService.findAll();
  // }

  @Post('filter')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAllPaging(@Body() allSeatDto: AllSeatDto) {
    return await this.seatsService.findAllPaging(allSeatDto);
  }

  @Get('/detail/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return await this.seatsService.findOne(+id);
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return await this.seatsService.update(+id, updateSeatDto);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.seatsService.remove(+id);
  }
}
