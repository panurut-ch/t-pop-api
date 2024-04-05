import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { EventsModule } from './events/events.module';
import { SeatsModule } from './seats/seats.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EventsModule,
    SeatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
