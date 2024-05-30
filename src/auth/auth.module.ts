import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { ApiKeyStrategy } from './apikey.strategy';

import { UsersModule } from 'src/users/users.module';
import { ArtistsModule } from 'src/artists/artists.module';
@Module({
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    ArtistsModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
