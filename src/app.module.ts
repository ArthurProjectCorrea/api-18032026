import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { CommonModule } from './common/common.module';
import { ScreensModule } from './screens/screens.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AccessesModule } from './accesses/accesses.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    PrismaModule,
    DepartmentsModule,
    PositionsModule,
    CommonModule,
    ScreensModule,
    PermissionsModule,
    AccessesModule,
    MailModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
