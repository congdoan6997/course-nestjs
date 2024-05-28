import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(loginDto);
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    const payload: PayloadType = { email: user.email, userId: user.id };
    const artist = await this.artistsService.findArtist(user.id);
    if (artist) {
      payload.artistId = artist.id;
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
