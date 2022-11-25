import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    // ALWAYS CREATE() AN OBJECT FIRST AND THEN SAVE() THE OBJECT
    // IF YOU SAVE() WITHOUT FIRST CREATE() THE LIFECYCLE HOOKS
    // WILL NOT BE PERFORMED, AND YOU NEVER WANT THAT.
    // THE SAME INFORMATION IS ALSO TRUE FOR REMOVE().
    // FIRST YOU NEED AND OBJECT AND THEN YOU REMOVE THE OBJECT
    // IN ORDER FOR THE LIFECYCLE HOOKS TO BE PERFORMED.
    // DELETE() WILL NOT INVOKE LIFECYCLE HOOKS.
    // INSERT() AND UPDATE() WILL NOT INVOKE LIFECYCLE HOOKS EITHER.
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('user not found');
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      // throw UserNotFoundException(`No user found with that id of: ${id}`);
      throw new NotFoundException(`No user found with that id of: ${id}`);
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
