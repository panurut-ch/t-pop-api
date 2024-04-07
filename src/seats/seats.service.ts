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
import { ReserveSeatDto } from './dto/reserve-seat.dto';
import { ViewReservedSeatDto } from './dto/view-reserved.dto';

@Injectable()
export class SeatsService {
  private readonly logger = new Logger(SeatsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createSeatDtoArray: CreateSeatDto[]) {
    try {
      const createdSeats = [];
      for (const createSeatDto of createSeatDtoArray) {
        this.logger.log('Create seat function');
        console.log('CreateSeatDto', createSeatDto);
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

        const createdSeat = await this.prisma.seat.create({
          data: createSeatDto,
        });

        createdSeats.push(createdSeat);
      }

      return { data: createdSeats };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAllPaging(allSeatDto): Promise<{ data: any[]; total: number }> {
    try {
      this.logger.log('findAllPaging function');
      console.log('allSeatDto', allSeatDto);
      const page = Number(allSeatDto.page) || 1;
      const perpage = Number(allSeatDto.perpage) || 10;
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
        filterOptions.event_id = Number(allSeatDto.event_id);
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
        return { message: 'Seat Updated successfully', data };
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
      return { message: 'Seat removed successfully', data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async reserve(reserveSeatDtoArray: ReserveSeatDto[]) {
    try {
      const reservedSeats = [];
      for (const reserveSeatDto of reserveSeatDtoArray) {
        const { id } = reserveSeatDto;
        this.logger.log('Reserve function id: ' + id);
        console.log('ReserveSeatDto', reserveSeatDto);

        const existingSeat = await this.prisma.seat.findUnique({
          where: { id },
        });

        if (!existingSeat) {
          throw new NotFoundException(`Seat with ID ${id} not found.`);
        }

        const updatedSeat = await this.prisma.seat.update({
          where: { id },
          data: {
            reserved_user_id: reserveSeatDto.reserved_user_id,
            seat_status: 'RESERVED',
          },
        });

        reservedSeats.push(updatedSeat);
      }

      return { message: 'Seats reserved successfully', data: reservedSeats };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async viewReservedSeat(
    viewReservedSeatDto: ViewReservedSeatDto,
  ): Promise<{ data: any[]; total: number }> {
    try {
      this.logger.log('findAllPaging function');
      console.log('viewReservedSeatDto', viewReservedSeatDto);
      const page = Number(viewReservedSeatDto.page) || 1;
      const perpage = Number(viewReservedSeatDto.perpage) || 10;
      const sortbycolumn = viewReservedSeatDto.sortbycolumn || 'id';
      const orderby = viewReservedSeatDto.orderby || 'asc';
      const skip = (page - 1) * perpage;
      const reserved_user_id: number = Number(
        viewReservedSeatDto.reserved_user_id,
      );

      const orderBy = {};
      orderBy[sortbycolumn] = orderby;

      const where = {
        reserved_user_id: reserved_user_id,
      };

      const [data, total] = await Promise.all([
        this.prisma.seat.findMany({
          where: where,
          orderBy: orderBy,
          take: perpage,
        }),
        this.prisma.seat.count({ where: where }),
      ]);
      return { total, data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
