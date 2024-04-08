import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AllEventDto } from './dto/all-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create(createEventDto: CreateEventDto) {
    try {
      this.logger.log('create');
      console.log('create', createEventDto);

      const existingEvent = await this.prisma.event.findUnique({
        where: { event_name: createEventDto.event_name },
      });
      if (existingEvent) {
        throw new ConflictException('Event already exists.');
      }

      const data = await this.prisma.event.create({
        data: createEventDto,
      });
      await this.invalidateCache();
      return { message: 'Event Created successfully', data };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Event already exists.');
      }
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAllPaging(
    allEventDto: AllEventDto,
  ): Promise<{ data: any[]; total: number }> {
    try {
      console.log('allEventDto', allEventDto);

      const hasFilters =
        allEventDto.event_name ||
        allEventDto.event_description ||
        allEventDto.event_date ||
        allEventDto.total_seat;

      if (hasFilters) {
        const page = Number(allEventDto.page) || 1;
        const perpage = Number(allEventDto.perpage) || 10;
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

        console.log('Data fetched without cache due to filters:', data);
        return { total, data };
      }

      const cacheKey = 'findAllPaging';
      const cachedData: { data: any[]; total: number } =
        await this.cacheService.get(cacheKey);

      if (cachedData) {
        console.log('Data fetched from cache:', cachedData);
        return cachedData;
      }

      const page = Number(allEventDto.page) || 1;
      const perpage = Number(allEventDto.perpage) || 10;
      const sortbycolumn = allEventDto.sortbycolumn || 'id';
      const orderby = allEventDto.orderby || 'asc';
      const skip = (page - 1) * perpage;

      const orderBy = {};
      orderBy[sortbycolumn] = orderby;

      const [data, total] = await Promise.all([
        this.prisma.event.findMany({
          orderBy: orderBy,
          take: perpage,
          skip: skip,
        }),
        this.prisma.event.count(),
      ]);

      await this.cacheService.set(cacheKey, { total, data }, 3600);

      console.log('Data fetched from source and cached:', data);
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
        const updatedEvent = await this.prisma.event.update({
          where: { id },
          data: updateEventDto,
        });
        await this.invalidateCache();
        return { message: 'Event Updated successfully', data: updatedEvent };
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
      await this.invalidateCache();
      return { message: 'Event Removed successfully', data };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async invalidateCache(): Promise<void> {
    const cacheKey = 'findAllPaging';
    const del_cache = await this.cacheService.del(cacheKey);
    this.logger.log('del_cache : ' + del_cache);
  }
}
