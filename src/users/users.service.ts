import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(userDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;
    user.password = await bcrypt.hash(userDto.password, salt);
    user.apiKey = uuid4();

    const newUser = await this.userRepository.save(user);
    delete newUser.password;
    return newUser;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return await this.userRepository.update(
      { id: userId },
      { twoFASecret: secret, enable2FA: true },
    );
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.userRepository.update(
      { id: userId },
      { enable2FA: false, twoFASecret: null },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return await this.userRepository.findOneBy({ apiKey });
  }
}
