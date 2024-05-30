import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ArtistsService } from 'src/artists/artists.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import * as speakeasy from 'speakeasy';

import { LoginDto } from './dto/login.dto';
import { PayloadType } from './types/payload.type';
import { Enable2FAType } from './types/auth.type';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}
  async login(
    loginDto: LoginDto,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    const user = await this.usersService.findOne(loginDto);
    if (user.enable2FA && user.twoFASecret) {
      return {
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        message:
          'Please send the one-time password/token from your Google Authenticator App',
      };
    }
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

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);
    if (user.enable2FA) {
      return {
        secret: user.twoFASecret,
      };
    }

    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.usersService.updateSecretKey(userId, user.twoFASecret);
    return {
      secret: user.twoFASecret,
    };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.usersService.disable2FA(userId);
  }

  async validate2FA(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: token,
      });
      if (!verified) {
        return { verified: false };
      } else {
        return { verified: true };
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid 2FA token');
    }
  }
}
