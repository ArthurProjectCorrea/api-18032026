import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '@/firebase/firebase.service';
import { Request } from 'express';
import { Scope } from '@/common/constants/permissions';

// Interface para estender o Request do Express com os dados do Firebase e Sistema
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    [key: string]: any;
  };
  userPermission?: {
    scope: Scope;
    departmentId: number | null;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
    } else if (request.headers.cookie) {
      // Tenta extrair o token dos cookies
      const cookies = request.headers.cookie.split('; ');
      const tokenCookie = cookies.find((c: string) => c.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Crachá (Token) não fornecido.');
    }

    try {
      // O Google verifica matematicamente se o token é válido e não expirou
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);

      // Anexamos os dados do usuário (ID, email) na requisição
      request.user = {
        ...decodedToken,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Sessão expirada ou token inválido.');
    }
  }
}
