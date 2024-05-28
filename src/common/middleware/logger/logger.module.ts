import { Module, NestMiddleware } from '@nestjs/common';

@Module({})
export class LoggerModule implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Request...', new Date().toDateString());
    next();
  }
}
