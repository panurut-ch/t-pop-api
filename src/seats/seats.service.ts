import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class SeatsService {
  private readonly logger = new Logger(SeatsService.name);

  constructor(private prisma: PrismaService) {}

  create(createSeatDto: CreateSeatDto) {
    return 'This action adds a new seat';
  }

  async findAll() {
    console.log('findAll');
    const [data, total] = await Promise.all([
      this.prisma.seat.findMany({
        orderBy: { id: 'asc' },
        take: 10,
      }),
      this.prisma.event.count(),
    ]);
    this.logger.log('findAll');
    return { total, data };
  }

  async findAllPaging(allSeatDto): Promise<{ data: any[]; total: number }> {
    console.log('allSeatDto', allSeatDto);
    const page = allSeatDto.page || 1;
    const perpage = allSeatDto.perpage || 10;
    const sortbycolumn = allSeatDto.sortbycolumn || 'id';
    const orderby = allSeatDto.orderby || 'asc';
    const skip = (page - 1) * perpage;

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    const filterOptions: Prisma.SeatWhereInput = {};
    if (allSeatDto.seat_zone) {
      filterOptions.seat_zone = allSeatDto.seat_zone;
    }
    if (allSeatDto.seat_row) {
      filterOptions.seat_row = allSeatDto.seat_row;
    }
    if (allSeatDto.seat_number) {
      filterOptions.seat_number = allSeatDto.seat_number;
    }
    if (allSeatDto.seat_status) {
      filterOptions.seat_status = allSeatDto.seat_status;
    }
    if (allSeatDto.event_id) {
      filterOptions.event_id = allSeatDto.event_id;
    }

    const [data, total] = await Promise.all([
      this.prisma.seat.findMany({
        where: filterOptions,
        orderBy: orderBy,
        take: perpage,
        skip: skip,
      }),
      this.prisma.seat.count({ where: filterOptions }),
    ]);
    this.logger.log('findAllPaging');
    return { total, data };
  }

  findOne(id: number) {
    return this.prisma.seat.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSeatDto: UpdateSeatDto) {
    console.log('updateSeatDto', updateSeatDto);
    this.logger.log('update');
    return this.prisma.seat.update({
      where: { id },
      data: updateSeatDto,
    });
  }

  async remove(id: number) {
    return this.prisma.seat.delete({
      where: { id },
    });
  }
}
