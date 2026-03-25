import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // Mailhog usa false para porta 1025
      auth: this.configService.get<string>('SMTP_USER')
        ? {
            user: this.configService.get<string>('SMTP_USER'),
            pass: this.configService.get<string>('SMTP_PASS'),
          }
        : undefined,
    });
  }

  async sendUserCredentials(email: string, name: string, password: string) {
    const from = this.configService.get<string>('SMTP_FROM');
    const webUrl =
      this.configService.get<string>('WEB_URL') || 'http://localhost:3000';

    const mailOptions = {
      from: `"Suporte Sistema" <${from}>`,
      to: email,
      subject: 'Bem-vindo! Suas credenciais de acesso',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #1e293b; margin-top: 0;">Olá, ${name}!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Sua conta foi criada com sucesso no sistema. Abaixo estão suas credenciais para o primeiro acesso:
          </p>
          
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">E-mail:</p>
            <p style="margin: 5px 0 15px 0; font-weight: bold; color: #0f172a;">${email}</p>
            
            <p style="margin: 0; font-size: 14px; color: #64748b;">Senha Temporária:</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #0f172a; font-family: monospace; font-size: 16px;">${password}</p>
          </div>

          <p style="color: #475569; font-size: 14px;">
            Recomendamos alternar sua senha logo após o primeiro login para maior segurança.
          </p>

          <a href="${webUrl}/login" 
             style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Acessar o Sistema
          </a>

          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Este é um e-mail automático, por favor não responda.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`E-mail de credenciais enviado para: ${email}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      // Não lançamos erro aqui para não travar a criação do usuário se o email falhar em dev
    }
  }
}
