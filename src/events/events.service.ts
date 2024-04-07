import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    try {
      this.logger.log('create');
      console.log('create', createEventDto);
      const data = await this.prisma.event.create({
        data: createEventDto,
      });
      return { message: 'Event Created successfully', data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAllPaging(allEventDto): Promise<{ data: any[]; total: number }> {
    try {
      this.logger.log('findAllPaging function');
      console.log('allEventDto', allEventDto);
      const page = parseInt(allEventDto.page) || 1;
      const perpage = parseInt(allEventDto.perpage) || 10;
      const sortbycolumn = allEventDto.sortbycolumn || 'id';
      const orderby = allEventDto.orderby || 'asc';
      const skip = (page - 1) * perpage;

      const orderBy = {};
      orderBy[sortbycolumn] = orderby;

      const filterOptions: Prisma.EventWhereInput = {};
      if (allEventDto.event_name) {
        filterOptions.event_name = { contains: allEventDto.event_name };
      }
      if (allEventDto.event_description) {
        filterOptions.event_description = {
          contains: allEventDto.event_description,
        };
      }
      if (allEventDto.event_date) {
        filterOptions.event_date = allEventDto.event_date;
      }
      if (allEventDto.total_seat) {
        filterOptions.total_seat = allEventDto.total_seat;
      }

      const [data, total] = await Promise.all([
        this.prisma.event.findMany({
          where: filterOptions,
          orderBy: orderBy,
          take: perpage,
          skip: skip,
        }),
        this.prisma.event.count({ where: filterOptions }),
      ]);
      return { total, data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log('findOne function id : ' + id);
      const data = await this.prisma.event.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Event not found.');
      }
      return { data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      this.logger.log('update function id : ' + id);
      console.log('updateEventDto', updateEventDto);

      const existingEvent = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        throw new NotFoundException('Event not found.');
      }

      try {
        const data = await this.prisma.event.update({
          where: { id },
          data: updateEventDto,
        });
        return { message: 'Event Updated successfully', data };
      } catch (error) {
        if (error.code === 'P2002') {
          throw new ConflictException('Event already exists.');
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
      this.logger.log('remove function id : ' + id);
      const existingSeat = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existingSeat) {
        throw new NotFoundException('Event not found.');
      }

      const data = await this.prisma.event.delete({
        where: { id },
      });
      return { message: 'Event Removed successfully', data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
