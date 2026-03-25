import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { AppService } from '@/app.service';
import { AuthGuard } from '@/auth/auth.guard';
import { PrismaService } from '@/prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
  };
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: AuthenticatedRequest) {
    const user = req.user;

    let profile = await this.prisma.profile.findUnique({
      where: { id: user.uid },
      include: {
        position: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          id: user.uid,
          name: user.name || user.email?.split('@')[0] || 'Usuário',
          avatar_url: user.picture || '',
          position_id: 1, // Default position_id
        },
        include: {
          position: {
            include: {
              department: true,
            },
          },
        },
      });
    }

    return {
      profile,
    };
  }

  @Get('modulos/agenda')
  @UseGuards(AuthGuard)
  obterDadosAgenda(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    return {
      mensagem: 'Acesso liberado com sucesso.',
      usuarioId: user.uid,
      email: user.email,
    };
  }

  @Get('profiles')
  @UseGuards(AuthGuard)
  async getProfiles() {
    return this.prisma.profile.findMany({
      include: {
        position: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  @Get('me/permissions')
  @UseGuards(AuthGuard)
  async getPermissions(@Request() req: AuthenticatedRequest) {
    const userId = req.user.uid;

    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        position: {
          include: {
            accesses: {
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
      return { permissions: {} };
    }

    const permissions: Record<string, Record<string, string>> = {};

    profile.position.accesses.forEach((access) => {
      const screenKey = access.screen.name_key;
      const permKey = access.permission.name_key;
      const scope = access.scope || 'all';

      if (!permissions[screenKey]) {
        permissions[screenKey] = {};
      }
      permissions[screenKey][permKey] = scope;
    });

    return {
      permissions,
    };
  }

  @Patch('profiles/:id')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      avatar_url?: string;
      position_id?: number;
      registration?: string;
    },
  ) {
    return this.prisma.profile.update({
      where: { id },
      data: {
        name: data.name,
        avatar_url: data.avatar_url,
        position_id: data.position_id,
        registration: data.registration,
      },
    });
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
