import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  const users: User[] = [];

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of users service.
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('asdf32@asf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hashed] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashed).toBeDefined();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf12@asdf.com', 'mypassword');
    const user = await service.signin('asdf12@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf50@asdf50.com', 'asdf');
    expect(service.signup('asdf50@asdf50.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf30@alskdfj30.com', 'password');
    expect(
      service.signin('laskdjf30@alskdfj30.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });
});
