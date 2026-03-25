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
import { LogsModule } from './logs/logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './common/interceptors/audit-log/audit-log.interceptor';
import { SchoolingModule } from './schooling/schooling.module';
import { PenaltyRegimeModule } from './penalty-regime/penalty-regime.module';
import { PeopleModule } from './people/people.module';
import { SeeuServiceModule } from './seeu-service/seeu-service.module';
import { CepModule } from './cep/cep.module';

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
    LogsModule,
    PeopleModule,
    SeeuServiceModule,
    SchoolingModule,
    PenaltyRegimeModule,
    CepModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
