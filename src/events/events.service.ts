import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  async findAll() {
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        orderBy: { event_date: 'desc' },
        take: 10,
      }),
      this.prisma.event.count(),
    ]);
    this.logger.log('findAll');
    return { total, data };
  }

  async findOne(id: number) {
    const data = await this.prisma.event.findUnique({
      where: { id },
    });
    this.logger.log('findOne');
    return { data };
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
