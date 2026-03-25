import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FirebaseService } from '@/firebase/firebase.service';
import { MailService } from '@/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
    private mailService: MailService,
  ) {}

  private generateRandomPassword(length = 10): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, position_id, registration } = createUserDto;

    // Como o profile não tem email, vamos confiar no Firebase para o único de email
    const password = this.generateRandomPassword();

    try {
      // 2. Criar no Firebase Auth
      const firebaseUser = await this.firebaseService.getAuth().createUser({
        email,
        password,
        displayName: name,
      });

      // 3. Criar Perfil no Banco Local (Prisma)
      const profile = await this.prisma.profile.create({
        data: {
          id: firebaseUser.uid,
          name,
          email,
          registration: registration || '',
          position_id,
        },
      });

      // 4. Enviar E-mail com as credenciais
      // Não damos await para não travar a resposta, mas o MailService tem try/catch
      void this.mailService.sendUserCredentials(email, name, password);

      return {
        message: 'Usuário criado com sucesso!',
        uid: firebaseUser.uid,
        profile,
      };
    } catch (error: unknown) {
      console.error('Erro ao criar usuário:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ((error as any).code === 'auth/email-already-exists') {
        throw new ConflictException(
          'Este e-mail já está sendo utilizado no Firebase.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao processar criação de usuário.',
      );
    }
  }

  async findAll() {
    return this.prisma.profile.findMany({
      include: {
        position: {
          include: {
            department: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async remove(id: string) {
    try {
      // 1. Deletar no Firebase
      await this.firebaseService.getAuth().deleteUser(id);

      // 2. Deletar no Prisma (o onDelete: Cascade cuidará se necessário, mas dependemos da estrutura)
      // Perfil não tem cascade direto de Screen, mas Accesses tem.
      return await this.prisma.profile.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new InternalServerErrorException('Erro ao remover usuário.');
    }
  }
}
