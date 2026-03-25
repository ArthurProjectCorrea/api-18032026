import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../../logs/logs.service';
import { AuthenticatedRequest } from '../../../auth/auth.guard';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const method = request.method;
    const url = request.url;
    const body = request.body as Record<string, unknown>;
    const user = request.user;

    // Apenas logamos mutações
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap((data: Record<string, unknown>) => {
          try {
            const pathParts = url.split('/');
            const table_name = pathParts[2] || 'unknown';
            const record_id = (request.params?.id || data?.id || data?.uid) as
              | string
              | number
              | undefined;

            let action = 'UNKNOWN';
            switch (method) {
              case 'POST':
                action = 'CREATE';
                break;
              case 'PATCH':
              case 'PUT':
                action = 'UPDATE';
                break;
              case 'DELETE':
                action = 'DELETE';
                break;
            }

            void this.logsService
              .create({
                user_id: (user?.uid || user?.id) as string,
                user_name: (user?.name || user?.email) as string,
                action,
                table_name,
                record_id: record_id?.toString(),
                description: `${action} em ${table_name}${record_id ? ` (ID: ${record_id})` : ''}`,
                new_data:
                  method !== 'DELETE'
                    ? (body as unknown as Prisma.InputJsonValue)
                    : (null as unknown as Prisma.InputJsonValue),
                old_data: null as unknown as Prisma.InputJsonValue,
              })
              .catch((error: unknown) => {
                console.error('Erro ao gravar log de auditoria:', error);
              });
          } catch (error) {
            console.error('Erro ao gravar log de auditoria:', error);
          }
        }),
      );
    }

    return next.handle();
  }
}
