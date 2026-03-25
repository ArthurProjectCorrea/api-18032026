import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
import { PERMISSIONS_KEY, RequiredPermission } from './permissions.decorator';
import { Scope } from '@/common/constants/permissions';
import { AuthenticatedRequest } from './auth.guard';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermission>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const firebaseUid = user.uid;

    // Fetch user profile and their permissions for the specific screen
    const profile = await this.prisma.profile.findUnique({
      where: { id: firebaseUid },
      include: {
        position: {
          include: {
            accesses: {
              where: {
                screen: { name_key: requiredPermission.screen },
                permission: { name_key: requiredPermission.action },
              },
              include: {
                screen: true,
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!profile || !profile.position) {
      throw new ForbiddenException('Usuário sem cargo atribuído.');
    }

    const access = profile.position.accesses[0];

    if (!access) {
      throw new ForbiddenException(
        `Sem permissão para ${requiredPermission.action} em ${requiredPermission.screen}`,
      );
    }

    // Attach scope and department_id to the request for service-level filtering
    request.userPermission = {
      scope: access.scope as Scope,
      departmentId: profile.position.department_id,
    };

    return true;
  }
}
