import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(userDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    userDto.password = await bcrypt.hash(userDto.password, salt);
    const user = await this.userRepository.save(userDto);
    delete user.password;
    return user;
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
}
