import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './testservice';

describe('Authentication System', () => {
  let app: INestApplication;
  let test_service;

  beforeEach(async () => {
    test_service = new TestService();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('handles a signup request', async () => {

  //   console.log('bilen');
  // });

  it('handles a signup request', async () => {
    await test_service.cleanDatabase();

    const email = 'asdfgh@asdfgh.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'asdfgh',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as s new user and then get the currently logged in user', async () => {
    await test_service.cleanDatabase();

    const email = 'asdf@asdf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
