import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class SeatsService {
  private readonly logger = new Logger(SeatsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createSeatDto: CreateSeatDto) {
    try {
      this.logger.log('create seat function');
      console.log('createSeatDto', createSeatDto);
      const { seat_zone, seat_row, seat_number, event_id } = createSeatDto;

      const existingSeat = await this.prisma.seat.findUnique({
        where: {
          seat_zone_seat_row_seat_number_event_id: {
            seat_zone,
            seat_row,
            seat_number,
            event_id,
          },
        },
      });

      if (existingSeat) {
        throw new ConflictException('Seat already exists');
      }

      const data = await this.prisma.seat.create({
        data: createSeatDto,
      });

      return { data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  // async findAll() {
  //   try {
  //     this.logger.log('findAll function');
  //     const [data, total] = await Promise.all([
  //       this.prisma.seat.findMany({
  //         orderBy: { id: 'asc' },
  //         take: 10,
  //       }),
  //       this.prisma.event.count(),
  //     ]);
  //     return { total, data };
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw error;
  //   }
  // }

  async findAllPaging(allSeatDto): Promise<{ data: any[]; total: number }> {
    try {
      this.logger.log('findAllPaging function');
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
      return { total, data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log('findOne function');
      const data = await this.prisma.seat.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Seat not found.');
      }
      return { data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(id: number, updateSeatDto: UpdateSeatDto) {
    try {
      this.logger.log('update function : ' + id);
      console.log('updateSeatDto', updateSeatDto);

      const existingSeat = await this.prisma.seat.findUnique({
        where: { id },
      });

      if (!existingSeat) {
        throw new NotFoundException('Seat not found.');
      }

      try {
        const data = await this.prisma.seat.update({
          where: { id },
          data: updateSeatDto,
        });
        return { data };
      } catch (error) {
        if (error.code === 'P2002') {
          throw new ConflictException('Seat already exists.');
        }
        throw error;
      }
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      this.logger.log('remove function');
      const existingSeat = await this.prisma.seat.findUnique({
        where: { id },
      });

      if (!existingSeat) {
        throw new NotFoundException('Seat not found.');
      }

      const data = await this.prisma.seat.delete({
        where: { id },
      });
      return { data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
