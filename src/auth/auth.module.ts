import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { ApiKeyStrategy } from './apikey.strategy';

import { UsersModule } from 'src/users/users.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ArtistsModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
