import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// service
import { AppService } from './app.service';
// controller
import { AppController } from './app.controller';
import { SongsController } from './songs/songs.controller';

// modules
import { SongsModule } from './songs/songs.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
// seed data
import { typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
// configuration
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
// validation env
import { validate } from 'env.validation';
@Module({
  imports: [
    SongsModule,
    LoggerModule,
    UsersModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    SeedModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerModule).forRoutes(SongsController);
  }
}
