import { AuthGuard } from '@nestjs/passport';
import { PayloadType } from './types/payload.type';
import { Observable } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

export class JwtArtistGuard extends AuthGuard('jwt') {
  canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
    // const request = context.switchToHttp().getRequest();
    // const payload: PayloadType = request.user;
    // if (!payload.artistId) {
    //   return false;
    // }
    return super.canActivate(context);
  }

  handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(user);
    if (user.artistId) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
