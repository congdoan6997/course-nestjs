import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsModule } from 'src/artists/artists.module';
@Module({
  providers: [AuthService, JwtStrategy],
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
