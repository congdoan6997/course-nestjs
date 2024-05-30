import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Enable2FAType } from './types/auth.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { BearerAuthGuard } from './bearer-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  signup(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    return this.authService.login(loginDto);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request() req,
    @Body() validateTokenDto: ValidateTokenDto,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FA(
      req.user.userId,
      validateTokenDto.token,
    );
  }

  @Get('profile')
  @UseGuards(BearerAuthGuard)
  getProfile(@Request() req) {
    delete req.user.password;
    return {
      user: req.user,
      message: 'Authenticated with api key',
    };
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
