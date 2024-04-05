import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function seedDataFromJson(jsonFilePath: string): Promise<void> {
  try {
    await prisma.event.deleteMany({});
    await prisma.seat.deleteMany({});
    await prisma.user.deleteMany({});

    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const data = JSON.parse(jsonData);

    for (const item of data) {
      const event = await prisma.event.create({
        data: {
          event_name: item.event_name,
          event_description: item.event_description,
          event_date: new Date(item.event_date),
          total_seat: item.total_seat,
          seats: {
            create: await generateSeats(item.total_seat, item.seats),
          },
        },
        include: {
          seats: true,
        },
      });

      console.log('Created event with seats:', event);
    }

    console.log('Data seeding completed.');

    await seedUsers();
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function generateSeats(
  totalSeats: number,
  seatData: any[],
): Promise<any[]> {
  const seats: any[] = [];
  const zones = ['VIP', 'General', 'Family'];
  const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const seatsPerZone = Math.floor(totalSeats / zones.length);
  const seatsPerRow = Math.ceil(seatsPerZone / rows.length);

  for (let zone of zones) {
    for (let row of rows) {
      let seatsInRow = seats.filter(
        (seat) => seat.seat_row === row && seat.seat_zone === zone,
      ).length;
      for (let i = 1; i <= seatsPerRow; i++) {
        if (seats.length < totalSeats && seatsInRow < 10) {
          seats.push({
            seat_zone: zone,
            seat_row: row,
            seat_number: i.toString().padStart(3, '0'),
            seat_status: 'AVAILABLE',
          });
          seatsInRow++;
        }
      }
    }
  }

  for (let i = 0; i < Math.min(seatData.length, seats.length); i++) {
    seats[i] = seatData[i];
  }

  return seats;
}

async function seedUsers(): Promise<void> {
  try {
    const passwordPanurut = await bcrypt.hash(
      'password-panurut',
      roundsOfHashing,
    );
    const passwordTpop = await bcrypt.hash('password-t-pop', roundsOfHashing);

    const user1 = await prisma.user.upsert({
      where: { email: 'panurut@panurut.dev' },
      update: {
        password: passwordPanurut,
      },
      create: {
        email: 'panurut@panurut.dev',
        name: 'Panurut Chinakul',
        password: passwordPanurut,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'hello@t-pop.com' },
      update: {
        password: passwordTpop,
      },
      create: {
        email: 'hello@t-pop.com',
        name: 'T-pop App',
        password: passwordTpop,
      },
    });

    console.log('Users seeding completed.');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

const jsonFilePath = 'prisma/data.json';
seedDataFromJson(jsonFilePath);
