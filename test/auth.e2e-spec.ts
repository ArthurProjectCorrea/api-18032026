/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { FirebaseService } from './../src/firebase/firebase.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const mockFirebaseService = {
    getAuth: () => ({
      verifyIdToken: jest.fn().mockImplementation((token: string) => {
        if (token === 'valid-token') {
          return Promise.resolve({
            uid: 'w1j7UwRA9MVUgkqfOk3exTmSOLi1',
            email: 'arthurdepaulacorrea@hotmail.com',
            name: 'Arthur Corrêa',
          });
        }
        return Promise.reject(new Error('Invalid token'));
      }),
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseService)
      .useValue(mockFirebaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const getRequest = () => {
    return (request as any).default || request;
  };

  it('/api/me (GET) - Valid Token', () => {
    return getRequest()(app.getHttpServer())
      .get('/api/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.profile.id).toBe('w1j7UwRA9MVUgkqfOk3exTmSOLi1');
        expect(res.body.profile.name).toBe('Arthur Corrêa');
      });
  });

  it('/api/me/permissions (GET) - Valid Token', () => {
    return getRequest()(app.getHttpServer())
      .get('/api/me/permissions')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.user_id).toBe('w1j7UwRA9MVUgkqfOk3exTmSOLi1');
        expect(res.body.permissions).toBeDefined();
      });
  });

  it('/api/me (GET) - Invalid Token', () => {
    return getRequest()(app.getHttpServer())
      .get('/api/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('/api/me (GET) - No Token', () => {
    return getRequest()(app.getHttpServer()).get('/api/me').expect(401);
  });
});
