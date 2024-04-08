import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { PrismaService } from './../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ReserveSeatDto } from './dto/reserve-seat.dto';
import { ViewReservedSeatDto } from './dto/view-reserved.dto';
import { SeatEntity, SeatStatus } from './entities/seat.entity';

describe('SeatsService', () => {
  let service: SeatsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatsService, PrismaService],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserve', () => {
    it('should reserve seats', async () => {
      const reserveSeatDtoArray: ReserveSeatDto[] = [
        {
          id: 1,
          seat_zone: 'VIP',
          seat_row: 'B',
          seat_number: '015',
          seat_status: SeatStatus.RESERVED,
          event_id: 1,
          reserved_user_id: 123,
        },
      ];
      jest.spyOn(prismaService.seat, 'findUnique').mockResolvedValue({
        id: 1,
        seat_zone: 'VIP',
        seat_row: 'B',
        seat_number: '015',
        seat_status: SeatStatus.AVAILABLE,
        created_date: new Date(),
        updated_date: new Date(),
        event_id: null,
        reserved_user_id: null,
      });
      jest.spyOn(prismaService.seat, 'update').mockResolvedValue({
        id: 1,
        seat_zone: 'VIP',
        seat_row: 'B',
        seat_number: '015',
        seat_status: SeatStatus.RESERVED,
        created_date: new Date(),
        updated_date: new Date(),
        event_id: null,
        reserved_user_id: 123,
      });

      const result = await service.reserve(reserveSeatDtoArray);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].seat_status).toEqual(SeatStatus.RESERVED);
    });

    it('should throw NotFoundException if seat not found', async () => {
      const reserveSeatDtoArray: ReserveSeatDto[] = [
        {
          id: 1,
          seat_zone: 'VIP',
          seat_row: 'B',
          seat_number: '015',
          seat_status: SeatStatus.RESERVED,
          event_id: 1,
          reserved_user_id: 123,
        },
      ];
      jest.spyOn(prismaService.seat, 'findUnique').mockResolvedValue(null);

      await expect(service.reserve(reserveSeatDtoArray)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('viewReservedSeat', () => {
    it('should return reserved seats', async () => {
      const viewReservedSeatDto: ViewReservedSeatDto = {
        page: 1,
        perpage: 10,
        reserved_user_id: 123,
      };
      const reservedSeat: SeatEntity = {
        id: 1,
        seat_zone: 'VIP',
        seat_row: 'B',
        seat_number: '015',
        seat_status: SeatStatus.RESERVED,
        created_date: new Date(),
        updated_date: new Date(),
        event_id: null,
        reserved_user_id: 123,
      };
      jest
        .spyOn(prismaService.seat, 'findMany')
        .mockResolvedValue([reservedSeat]);
      jest.spyOn(prismaService.seat, 'count').mockResolvedValue(1);

      const result = await service.viewReservedSeat(viewReservedSeatDto);

      expect(result).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].seat_status).toEqual(SeatStatus.RESERVED);
    });

    it('should return empty array if no reserved seats found', async () => {
      const viewReservedSeatDto: ViewReservedSeatDto = {
        page: 1,
        perpage: 10,
        reserved_user_id: 123,
      };
      jest.spyOn(prismaService.seat, 'findMany').mockResolvedValue([]);
      jest.spyOn(prismaService.seat, 'count').mockResolvedValue(0);

      const result = await service.viewReservedSeat(viewReservedSeatDto);

      expect(result).toBeDefined();
      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });
  });
});
